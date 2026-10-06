const fs = require('fs');
let filePath = 'src/components/site/Menu.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `  const categories = useMemo(() => {
    let sortedCats = [...staticCategories];
    if (typeof window !== 'undefined') {
      const savedOrder = localStorage.getItem("categoryOrder");
      if (savedOrder) {
        try {
          const orderArr = JSON.parse(savedOrder);
          sortedCats.sort((a, b) => {
            let indexA = orderArr.indexOf(a.id);
            let indexB = orderArr.indexOf(b.id);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
          });
        } catch (e) {}
      }
    }
    return sortedCats;
  }, []);
  const products = useMemo(() => staticProducts, []);`;

const replacement = `  const categories = useMemo(() => {
    const rawCats = data?.categories && data.categories.length > 0 ? data.categories : staticCategories;
    let sortedCats = [...rawCats];
    if (typeof window !== 'undefined') {
      const savedOrder = localStorage.getItem("categoryOrder");
      if (savedOrder) {
        try {
          const orderArr = JSON.parse(savedOrder);
          sortedCats.sort((a: any, b: any) => {
            let indexA = orderArr.indexOf(a.id);
            let indexB = orderArr.indexOf(b.id);
            if (indexA === -1) indexA = 999;
            if (indexB === -1) indexB = 999;
            return indexA - indexB;
          });
        } catch (e) {}
      }
    }
    return sortedCats;
  }, [data?.categories]);

  const products = useMemo(() => {
    if (data?.products && data.products.length > 0) {
      return data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        price: p.base_price,
        image: p.image_url || PLACEHOLDER,
        category: p.category_id,
        manage_stock: p.manage_stock,
        stock: p.stock
      }));
    }
    return staticProducts;
  }, [data?.products]);`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacement);
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('Success');
} else {
    console.log('Target string not found!');
}
