import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Lucasduda28123@db.tkwqshhsmegirqmmjuyv.supabase.co:5432/postgres'
});

async function main() {
  await client.connect();
  
  try {
    // Drop policies if they exist to avoid error
    await client.query(`DROP POLICY IF EXISTS "Anyone view their orders" ON public.orders;`);
    await client.query(`DROP POLICY IF EXISTS "Anyone view their order_items" ON public.order_items;`);

    await client.query(`
      CREATE POLICY "Anyone view their orders" ON public.orders FOR SELECT USING (true);
      GRANT SELECT ON public.orders TO anon;
      
      CREATE POLICY "Anyone view their order_items" ON public.order_items FOR SELECT USING (true);
      GRANT SELECT ON public.order_items TO anon;
    `);
    console.log("RLS policies added successfully.");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

main();
