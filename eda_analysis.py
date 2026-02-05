"""
Exploratory Data Analysis (EDA) Script for Antivenom Database.

This script performs comprehensive analysis of the antivenom distribution centers
database and generates metrics for use in the application's metrics page.

Output:
    - .database_info/summary.json: General statistics
    - .database_info/by_region.json: Aggregated data by region
    - .database_info/by_state.json: Aggregated data by state
    - .database_info/by_municipality.json: Top municipalities
    - .database_info/coordinates_stats.json: Geographic bounds
    - .database_info/eda_report.md: Human-readable report

Author: Auto-generated
Date: 2026-02-05
"""

import json
import logging
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class NumpyEncoder(json.JSONEncoder):
    """Custom JSON encoder for numpy types."""
    
    def default(self, obj: Any) -> Any:
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)

# Paths
PROJECT_ROOT = Path(__file__).parent
DATABASE_PATH = PROJECT_ROOT / "soro-map-mvp" / "antivenom_db.xlsx"
OUTPUT_DIR = PROJECT_ROOT / ".database_info"


def load_database() -> pd.DataFrame:
    """
    Load the antivenom database from Excel file.
    
    Returns:
        DataFrame with the database contents.
    
    Raises:
        FileNotFoundError: If database file doesn't exist.
    """
    if not DATABASE_PATH.exists():
        raise FileNotFoundError(f"Database not found at {DATABASE_PATH}")
    
    logger.info(f"Loading database from {DATABASE_PATH}")
    df = pd.read_excel(DATABASE_PATH)
    logger.info(f"Loaded {len(df)} records with {len(df.columns)} columns")
    
    return df


def clean_column_names(df: pd.DataFrame) -> pd.DataFrame:
    """
    Standardize column names for easier processing.
    
    Args:
        df: Input DataFrame.
    
    Returns:
        DataFrame with cleaned column names.
    """
    column_mapping = {
        'Region': 'region',
        'Federal_Un': 'federal_unit',
        'FU': 'uf',
        'Municipio': 'municipio',
        'Unidade de': 'unidade',
        'Endereço': 'endereco',
        'Telefone': 'telefone',
        'CNES': 'cnes',
        'Atendiment': 'atendimento_tipo',
        'Atendime_1': 'atendimento_info',
        'Lat (Y)': 'latitude',
        'Lon (X)': 'longitude',
    }
    
    df = df.rename(columns=column_mapping)
    # Drop unnecessary columns
    cols_to_drop = ['unknown', 'layer', 'path']
    df = df.drop(columns=[c for c in cols_to_drop if c in df.columns], errors='ignore')
    
    return df


def calculate_summary_stats(df: pd.DataFrame) -> dict[str, Any]:
    """
    Calculate general summary statistics.
    
    Args:
        df: Input DataFrame.
    
    Returns:
        Dictionary with summary statistics.
    """
    stats = {
        "total_centers": len(df),
        "total_states": df['uf'].nunique(),
        "total_regions": df['region'].nunique(),
        "total_municipalities": df['municipio'].nunique(),
        "centers_with_cnes": df['cnes'].notna().sum(),
        "centers_with_phone": df['telefone'].notna().sum(),
        "centers_with_coordinates": (
            df['latitude'].notna() & df['longitude'].notna()
        ).sum(),
        "columns": list(df.columns),
        "missing_data": {
            col: int(df[col].isna().sum()) 
            for col in df.columns 
            if df[col].isna().sum() > 0
        },
    }
    
    logger.info(f"Summary: {stats['total_centers']} centers across {stats['total_states']} states")
    return stats


def analyze_by_region(df: pd.DataFrame) -> list[dict[str, Any]]:
    """
    Aggregate statistics by region.
    
    Args:
        df: Input DataFrame.
    
    Returns:
        List of region statistics.
    """
    region_stats = []
    
    for region in df['region'].unique():
        region_df = df[df['region'] == region]
        
        region_stats.append({
            "region": region,
            "total_centers": len(region_df),
            "percentage": round(len(region_df) / len(df) * 100, 2),
            "states": region_df['uf'].nunique(),
            "municipalities": region_df['municipio'].nunique(),
            "states_list": sorted(region_df['uf'].unique().tolist()),
        })
    
    # Sort by total_centers descending
    region_stats.sort(key=lambda x: x['total_centers'], reverse=True)
    
    logger.info(f"Analyzed {len(region_stats)} regions")
    return region_stats


def analyze_by_state(df: pd.DataFrame) -> list[dict[str, Any]]:
    """
    Aggregate statistics by state (UF).
    
    Args:
        df: Input DataFrame.
    
    Returns:
        List of state statistics.
    """
    state_stats = []
    
    for uf in df['uf'].unique():
        state_df = df[df['uf'] == uf]
        
        state_stats.append({
            "uf": uf,
            "federal_unit": state_df['federal_unit'].iloc[0] if 'federal_unit' in state_df.columns else uf,
            "region": state_df['region'].iloc[0],
            "total_centers": len(state_df),
            "percentage": round(len(state_df) / len(df) * 100, 2),
            "municipalities": state_df['municipio'].nunique(),
            "centers_per_municipality": round(len(state_df) / state_df['municipio'].nunique(), 2),
        })
    
    # Sort by total_centers descending
    state_stats.sort(key=lambda x: x['total_centers'], reverse=True)
    
    logger.info(f"Analyzed {len(state_stats)} states")
    return state_stats


def analyze_top_municipalities(df: pd.DataFrame, top_n: int = 20) -> list[dict[str, Any]]:
    """
    Get top municipalities by number of centers.
    
    Args:
        df: Input DataFrame.
        top_n: Number of top municipalities to return.
    
    Returns:
        List of municipality statistics.
    """
    muni_counts = df.groupby(['municipio', 'uf', 'region']).size().reset_index(name='total_centers')
    muni_counts = muni_counts.sort_values('total_centers', ascending=False).head(top_n)
    
    result = muni_counts.to_dict('records')
    logger.info(f"Top municipality: {result[0]['municipio']} with {result[0]['total_centers']} centers")
    
    return result


def analyze_coordinates(df: pd.DataFrame) -> dict[str, Any]:
    """
    Analyze geographic coordinates for map bounds.
    
    Args:
        df: Input DataFrame.
    
    Returns:
        Dictionary with coordinate statistics.
    """
    valid_coords = df[df['latitude'].notna() & df['longitude'].notna()]
    
    stats = {
        "total_with_coordinates": len(valid_coords),
        "total_missing_coordinates": len(df) - len(valid_coords),
        "bounds": {
            "min_lat": float(valid_coords['latitude'].min()),
            "max_lat": float(valid_coords['latitude'].max()),
            "min_lng": float(valid_coords['longitude'].min()),
            "max_lng": float(valid_coords['longitude'].max()),
        },
        "center": {
            "lat": float(valid_coords['latitude'].mean()),
            "lng": float(valid_coords['longitude'].mean()),
        },
    }
    
    logger.info(f"Geographic center: ({stats['center']['lat']:.4f}, {stats['center']['lng']:.4f})")
    return stats


def generate_markdown_report(
    summary: dict,
    by_region: list,
    by_state: list,
    top_municipalities: list,
    coords: dict
) -> str:
    """
    Generate a human-readable Markdown report.
    
    Args:
        summary: Summary statistics.
        by_region: Region statistics.
        by_state: State statistics.
        top_municipalities: Top municipalities.
        coords: Coordinate statistics.
    
    Returns:
        Markdown formatted report string.
    """
    report = f"""# Antivenom Database - Exploratory Data Analysis

## Summary

| Metric | Value |
|--------|-------|
| Total Centers | **{summary['total_centers']:,}** |
| States (UFs) | **{summary['total_states']}** |
| Regions | **{summary['total_regions']}** |
| Municipalities | **{summary['total_municipalities']:,}** |
| Centers with CNES | {summary['centers_with_cnes']:,} ({summary['centers_with_cnes']/summary['total_centers']*100:.1f}%) |
| Centers with Phone | {summary['centers_with_phone']:,} ({summary['centers_with_phone']/summary['total_centers']*100:.1f}%) |
| Centers with Coordinates | {summary['centers_with_coordinates']:,} ({summary['centers_with_coordinates']/summary['total_centers']*100:.1f}%) |

---

## Distribution by Region

| Region | Centers | % | States | Municipalities |
|--------|---------|---|--------|----------------|
"""
    
    for r in by_region:
        report += f"| {r['region']} | {r['total_centers']:,} | {r['percentage']}% | {r['states']} | {r['municipalities']} |\n"
    
    report += """
---

## Top 10 States

| UF | Region | Centers | % | Municipalities |
|----|--------|---------|---|----------------|
"""
    
    for s in by_state[:10]:
        report += f"| {s['uf']} | {s['region']} | {s['total_centers']:,} | {s['percentage']}% | {s['municipalities']} |\n"
    
    report += """
---

## Top 10 Municipalities

| Municipality | UF | Region | Centers |
|--------------|----|----|---------|
"""
    
    for m in top_municipalities[:10]:
        report += f"| {m['municipio']} | {m['uf']} | {m['region']} | {m['total_centers']} |\n"
    
    report += f"""
---

## Geographic Bounds

| Metric | Value |
|--------|-------|
| Min Latitude | {coords['bounds']['min_lat']:.6f} |
| Max Latitude | {coords['bounds']['max_lat']:.6f} |
| Min Longitude | {coords['bounds']['min_lng']:.6f} |
| Max Longitude | {coords['bounds']['max_lng']:.6f} |
| Center (Lat) | {coords['center']['lat']:.6f} |
| Center (Lng) | {coords['center']['lng']:.6f} |

---

## Data Quality

### Missing Data

| Column | Missing Count |
|--------|---------------|
"""
    
    for col, count in summary.get('missing_data', {}).items():
        report += f"| {col} | {count} |\n"
    
    if not summary.get('missing_data'):
        report += "| - | No missing data |\n"
    
    report += """
---

*Report generated automatically by eda_analysis.py*
"""
    
    return report


def save_json(data: Any, filename: str) -> None:
    """
    Save data to JSON file.
    
    Args:
        data: Data to save.
        filename: Output filename.
    """
    filepath = OUTPUT_DIR / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, cls=NumpyEncoder)
    logger.info(f"Saved {filepath}")


def main() -> None:
    """Main entry point for the EDA script."""
    logger.info("Starting Exploratory Data Analysis")
    
    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)
    logger.info(f"Output directory: {OUTPUT_DIR}")
    
    # Load and clean data
    df = load_database()
    df = clean_column_names(df)
    
    # Perform analyses
    summary = calculate_summary_stats(df)
    by_region = analyze_by_region(df)
    by_state = analyze_by_state(df)
    top_municipalities = analyze_top_municipalities(df)
    coords = analyze_coordinates(df)
    
    # Save JSON outputs
    save_json(summary, "summary.json")
    save_json(by_region, "by_region.json")
    save_json(by_state, "by_state.json")
    save_json(top_municipalities, "by_municipality.json")
    save_json(coords, "coordinates_stats.json")
    
    # Generate and save Markdown report
    report = generate_markdown_report(
        summary, by_region, by_state, top_municipalities, coords
    )
    report_path = OUTPUT_DIR / "eda_report.md"
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    logger.info(f"Saved {report_path}")
    
    # Print summary to console
    print("\n" + "=" * 60)
    print("EXPLORATORY DATA ANALYSIS COMPLETE")
    print("=" * 60)
    print(f"\nTotal Centers: {summary['total_centers']:,}")
    print(f"Total States: {summary['total_states']}")
    print(f"Total Regions: {summary['total_regions']}")
    print(f"Total Municipalities: {summary['total_municipalities']:,}")
    print(f"\nOutput saved to: {OUTPUT_DIR.absolute()}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
