const fs = require('fs');
const file = 'src/components/site/Menu.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /const categories = useMemo\(\(\) => \{[\s\S]*?\}, \[\]\);/;
const replacement = `const categories = useMemo(() => {
    let rawCats = data?.categories && data.categories.length > 0 ? data.categories : staticCategories;
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
  }, [data?.categories]);`;

code = code.replace(regex, replacement);
fs.writeFileSync(file, code);
console.log('Categories useMemo updated.');
