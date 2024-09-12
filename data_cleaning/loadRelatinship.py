from neo4j import GraphDatabase
import pandas as pd
import logging
import tqdm
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the Neo4j connection details
uri = "neo4j+s://3da3d3fb.databases.neo4j.io"
username = "neo4j"
password = "Dt5KGgA89IwGG-FpMXVCfZDhmUIuEkIIiGhs8D-5chA"

# Initialize the Neo4j driver
driver = GraphDatabase.driver(uri, auth=(username, password))

BATCH_SIZE = 1000  # Adjust the batch size according to your requirements

def load_data_to_neo4j(csv_file):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file)

    with driver.session() as session:
        try:
            for start in tqdm.tqdm(range(0, len(df), BATCH_SIZE)):
                batch = df.iloc[start:start + BATCH_SIZE]
                session.write_transaction(create_relationships, batch.to_dict('records'))
                logger.info(f"Processed rows {start} to {start + len(batch) - 1}")
            logger.info("Data loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load data: {e}")

def create_relationships(tx, rows):
    query = (
        "UNWIND $rows AS row "
        "MATCH (source:Airport {iata: row.src_iata_icao}) "
        "MATCH (target:Airport {iata: row.target_iata_icao}) "
        "CREATE (source)-[:CONNECTED_TO { "
        "   airline_iata: row.airline_iata, "
        "   airline_id: row.airline_id, "
        "   code_share: row.code_share, "
        "   equipment: row.equipment "
        "}]->(target)"
    )
    tx.run(query, rows=rows)

if __name__ == "__main__":
    # Provide the path to your CSV file
    csv_file_path = '/Users/apple/Desktop/projects/TourEZ/data_cleaning/Flights_Dataset/Routes.csv'
    load_data_to_neo4j(csv_file_path)

    # Close the driver
    driver.close()
