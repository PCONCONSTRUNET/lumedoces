const fs = require('fs');
const file = 'src/components/site/CartDrawer.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `  const [storeSettings, setStoreSettings] = useState<{ delivery_enabled: boolean, pickup_enabled: boolean, delivery_fee: number }>({ delivery_enabled: true, pickup_enabled: true, delivery_fee: 0 });
  const finalDeliveryFee = deliveryMode === "delivery" && storeSettings.delivery_enabled ? storeSettings.delivery_fee : 0;
  const finalTotal = Math.max(0, total - discount) + finalDeliveryFee;
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);`;

const replacement1 = `  const [storeSettings, setStoreSettings] = useState<{ delivery_enabled: boolean, pickup_enabled: boolean, delivery_fee: number }>({ delivery_enabled: true, pickup_enabled: true, delivery_fee: 0 });
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);
  const matchedNeighborhood = selectedAddress 
    ? neighborhoods.find(n => n.name.toLowerCase() === selectedAddress.neighborhood.toLowerCase())
    : null;
    
  // finalDeliveryFee is from the neighborhood if matched, else fallback to storeSettings
  const finalDeliveryFee = deliveryMode === "delivery" && storeSettings.delivery_enabled 
    ? (matchedNeighborhood ? matchedNeighborhood.fee : storeSettings.delivery_fee) 
    : 0;
  const finalTotal = Math.max(0, total - discount) + finalDeliveryFee;`;

code = code.replace(target1, replacement1);

const target2 = `        if (!data.pickup_enabled && data.delivery_enabled) setDeliveryMode("delivery");
        if (!data.delivery_enabled && data.pickup_enabled) setDeliveryMode("pickup");
      }
    });
  }, [open]);`;

const replacement2 = `        if (!data.pickup_enabled && data.delivery_enabled) setDeliveryMode("delivery");
        if (!data.delivery_enabled && data.pickup_enabled) setDeliveryMode("pickup");
      }
    });

    supabaseUntyped.from("delivery_neighborhoods").select("*").eq("is_active", true).then(({ data }: any) => {
      if (data) setNeighborhoods(data);
    });
  }, [open]);`;

code = code.replace(target2, replacement2);

// Make sure we show the delivery fee in the summary.
// Let's add a message next to the delivery option or in the total breakdown.
// Wait, is there a total breakdown?
const target3 = `<div className="flex justify-between items-center text-gray-900 mt-2">
                    <span className="font-extrabold text-[15px]">Total Geral:</span>
                    <span className="font-black text-[17px] text-green-700">{formatBRL(finalTotal)}</span>
                  </div>`;

const replacement3 = `<div className="flex justify-between items-center text-gray-600">
                    <span className="font-semibold text-sm">Taxa de entrega:</span>
                    <span className="font-semibold text-sm">{deliveryMode === 'delivery' ? formatBRL(finalDeliveryFee) : "Grátis (Retirada)"}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900 mt-2">
                    <span className="font-extrabold text-[15px]">Total Geral:</span>
                    <span className="font-black text-[17px] text-green-700">{formatBRL(finalTotal)}</span>
                  </div>`;

if(code.includes(target3)) {
   code = code.replace(target3, replacement3);
}

fs.writeFileSync(file, code);
console.log('CartDrawer updated.');
