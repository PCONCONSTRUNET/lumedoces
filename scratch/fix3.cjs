const fs = require('fs');
let cartPath = 'src/components/site/CartDrawer.tsx';
let cart = fs.readFileSync(cartPath, 'utf8');

cart = cart.replace('  const [orderNumber, setOrderNumber] = useState<number | null>(null);\r\n\r\n  const pointsToUse = usePoints ? Math.floor(pointsBalance / 100) * 100 : 0;', 
`  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [pointsBalance, setPointsBalance] = useState<number>(0);
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const pointsToUse = usePoints ? Math.floor(pointsBalance / 100) * 100 : 0;`);

fs.writeFileSync(cartPath, cart, 'utf8');
console.log('Fixed CartDrawer states for real!');
