import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Lucasduda28123@db.tkwqshhsmegirqmmjuyv.supabase.co:5432/postgres'
});

async function main() {
  await client.connect();
  
  try {
    await client.query(`ALTER TABLE public.orders ADD COLUMN order_number SERIAL;`);
    console.log("order_number added successfully.");
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log("Column already exists.");
    } else {
      console.error("Error executing query:", err);
    }
  } finally {
    await client.end();
  }
}

main();
