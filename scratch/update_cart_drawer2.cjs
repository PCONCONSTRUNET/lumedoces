const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/components/site/CartDrawer.tsx');
let code = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

const t1 = `  const finalDeliveryFee = deliveryMode === "delivery" && storeSettings.delivery_enabled ? storeSettings.delivery_fee : 0;
  const finalTotal = Math.max(0, total - discount) + finalDeliveryFee;`.replace(/\r\n/g, '\n');

const r1 = `  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
  const matchedNeighborhood = selectedAddress 
    ? neighborhoods.find(n => n.name.toLowerCase() === selectedAddress.neighborhood.toLowerCase())
    : null;
    
  let baseDeliveryFee = deliveryMode === "delivery" && storeSettings.delivery_enabled 
    ? (matchedNeighborhood ? matchedNeighborhood.fee : storeSettings.delivery_fee) 
    : 0;

  if (coupon && coupon.free_shipping) {
    baseDeliveryFee = 0;
  }
  const finalDeliveryFee = baseDeliveryFee;
  const finalTotal = Math.max(0, total - discount) + finalDeliveryFee;`.replace(/\r\n/g, '\n');

if (code.includes(t1)) {
  code = code.replace(t1, r1);
  console.log("t1 replaced");
} else {
  console.log("t1 NOT found");
}

const t2 = `    supabaseUntyped.from("store_settings").select("*").limit(1).maybeSingle().then(({ data }: any) => {
      if (data) {
        setStoreSettings(data);
        if (!data.pickup_enabled && data.delivery_enabled) setDeliveryMode("delivery");
        if (!data.delivery_enabled && data.pickup_enabled) setDeliveryMode("pickup");
      }
    });
  }, [open]);`.replace(/\r\n/g, '\n');

const r2 = `    supabaseUntyped.from("store_settings").select("*").limit(1).maybeSingle().then(({ data }: any) => {
      if (data) {
        setStoreSettings(data);
        if (!data.pickup_enabled && data.delivery_enabled) setDeliveryMode("delivery");
        if (!data.delivery_enabled && data.pickup_enabled) setDeliveryMode("pickup");
      }
    });

    supabaseUntyped.from("delivery_neighborhoods").select("*").eq("is_active", true).then(({ data }: any) => {
      if (data) setNeighborhoods(data);
    });
  }, [open]);`.replace(/\r\n/g, '\n');

if (code.includes(t2)) {
  code = code.replace(t2, r2);
  console.log("t2 replaced");
} else {
  console.log("t2 NOT found");
}

fs.writeFileSync(file, code);
console.log('CartDrawer updated 3.');
