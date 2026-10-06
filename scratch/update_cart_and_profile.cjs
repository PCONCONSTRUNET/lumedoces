const fs = require('fs');

// --- Patch CartDrawer.tsx ---
let cartPath = 'src/components/site/CartDrawer.tsx';
let cart = fs.readFileSync(cartPath, 'utf8');

// Add states
cart = cart.replace('const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);',
`const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(0);
  const [usePoints, setUsePoints] = useState<boolean>(false);`);

// Update total calculation to include points discount
cart = cart.replace('const discount = coupon ? getCouponDiscount(coupon, total) : 0;',
`const pointsToUse = usePoints ? Math.floor(pointsBalance / 100) * 100 : 0;
  const pointsDiscount = (pointsToUse / 100) * 5;
  const discount = (coupon ? getCouponDiscount(coupon, total) : 0) + pointsDiscount;`);

// Update session fetching
cart = cart.replace('supabase.auth.getSession().then(({ data: { session } }) => {\n      if (session?.user?.user_metadata?.addresses) {',
`supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUserId(session.user.id);
        supabaseUntyped.from("customer_points_balance").select("balance").eq("user_id", session.user.id).single().then(({ data }: any) => {
          if (data) setPointsBalance(data.balance);
        }).catch(() => {});
      }
      if (session?.user?.user_metadata?.addresses) {`);

// Add UI for points in the drawer (above coupon)
cart = cart.replace('{/* Cupom */}',
`{/* Pontos */}
        {pointsBalance >= 100 && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-brand/20 bg-brand/5 p-4">
            <div>
              <p className="font-bold text-brand">Usar pontos fidelidade</p>
              <p className="text-sm text-foreground/70">Você tem {pointsBalance} pontos (R$ {((Math.floor(pointsBalance / 100) * 100) / 100 * 5).toFixed(2).replace('.',',')} off)</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
                className="h-5 w-5 accent-brand"
              />
            </div>
          </div>
        )}

        {/* Cupom */}`);

// Update orderPayload
cart = cart.replace('status: pay === "pix" ? "pending" : "confirmed",\n      };',
`status: pay === "pix" ? "pending" : "confirmed",
        user_id: sessionUserId,
        points_used: pointsToUse,
        points_earned: Math.floor(finalTotal / 5),
      };`);

cart = cart.replace('status: pay === "pix" ? "pending" : "confirmed",\n        });',
`status: pay === "pix" ? "pending" : "confirmed",
          user_id: sessionUserId,
          points_used: pointsToUse,
          points_earned: Math.floor(finalTotal / 5),
        });`);

fs.writeFileSync(cartPath, cart, 'utf8');
console.log('CartDrawer updated.');

// --- Patch perfil.tsx ---
let perfilPath = 'src/routes/perfil.tsx';
let perfil = fs.readFileSync(perfilPath, 'utf8');

perfil = perfil.replace('const [userData, setUserData] = useState<any>(null);',
`const [userData, setUserData] = useState<any>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(0);`);

perfil = perfil.replace('setUserData(session.user.user_metadata);\n      }',
`setUserData(session.user.user_metadata);
        const supabaseUntyped = supabase as any;
        supabaseUntyped.from("customer_points_balance").select("balance").eq("user_id", session.user.id).single().then(({ data }: any) => {
          if (data) setPointsBalance(data.balance);
        }).catch(() => {});
      }`);

perfil = perfil.replace('{/* Lista de Opções do Menu */}',
`{/* Carteira de Pontos */}
            {session?.user?.email?.includes('@cliente') && (
              <div className="bg-gradient-to-r from-brand to-highlight rounded-3xl shadow-sm border border-brand/20 p-6 flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-bold opacity-90">Meus Pontos</h3>
                  <p className="text-3xl font-extrabold">{pointsBalance} pts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Equivale a</p>
                  <p className="text-xl font-bold">R$ {((Math.floor(pointsBalance / 100) * 100) / 100 * 5).toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            )}

            {/* Lista de Opções do Menu */}`);

fs.writeFileSync(perfilPath, perfil, 'utf8');
console.log('perfil updated.');
