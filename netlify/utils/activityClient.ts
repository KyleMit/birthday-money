import { TableClient, odata, TableInsertEntityHeaders, TableEntity, TransactionAction } from "@azure/data-tables";

const connectionString = "DefaultEndpointsProtocol=https;AccountName=birthdaymoney;AccountKey=gW7qM7W46dgkBxdRbsDh7QMOnbHCeejNffbTpn6DT8QhnDvO5u7r6QuFUNBJM39tDPcTrhSh6wds+ASt8fF54g==;EndpointSuffix=core.windows.net"
const activityTableName = "activity"
const defaultPartitionKey = "GLOBAL-ACTIVITY"


function getActivityTableClient(): TableClient {
  const tableClient = TableClient.fromConnectionString(connectionString, activityTableName)
  return tableClient;
}

export async function getAllData(): Promise<IActivityData[]> {
  const records = await getAll()

  const data = records.map(r => {
    const {timestamp, choice, round, total} = r
    return {timestamp, choice, round, total}
  })

  return data;
}

export async function getAll(): Promise<IActivityRecord[]> {
  const client = getActivityTableClient();

  const listResults = client.listEntities<IActivityRecord>({
    queryOptions: { filter: odata`PartitionKey eq ${defaultPartitionKey}` },
  });

  // const tableServiceClient = TableServiceClient.fromConnectionString(connectionString)
  let records: IActivityRecord[] = [];
  for await (const record of listResults) {
    records.push(record)
  }

  return records;
}


export async function createActivity(data: IActivityData): Promise<TableInsertEntityHeaders> {
  const client = getActivityTableClient();

  const task: IActivityInfo = {
    partitionKey: defaultPartitionKey,
    rowKey: String(data.round),
    ...data
  };

  let result = await client.createEntity(task);
  return result;
}

export async function truncateData(): Promise<void> {
  const client = getActivityTableClient();
  const allRows = await getAll();


  const batchActions: TransactionAction[] = allRows.map(row => {
    const entity: TableEntity = {
      partitionKey: row.partitionKey,
      rowKey: row.rowKey
    }
    return ["delete", entity]
  })


  await client.submitTransaction(batchActions);
}


export interface IActivityData {
  choice: string; // safe | risky
  total: number;
  round: number;
}

interface IActivityInfo extends TableEntity<IActivityData> {}

interface IActivityRecord extends IActivityInfo {
  etag: string;
  timestamp: string;
}
