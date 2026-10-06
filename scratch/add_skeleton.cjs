const fs = require('fs');
const filePath = 'src/components/site/Menu.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target = `{filtered.length === 0 ? (`;
const replacement = `{isLoading ? (
          <div className="mt-5 space-y-16">
            {[1, 2].map((i) => (
              <div key={i} className="mb-16">
                <div className="mb-6">
                  <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"></div>
                </div>
                <div className="no-scrollbar grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="sm:w-[280px] shrink-0 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm animate-pulse">
                      <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 pt-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (`;

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced successfully.');
