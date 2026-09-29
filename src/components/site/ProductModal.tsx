import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { formatBRL, useCart } from "@/store/cart";
import type { Product } from "@/data/menu";
import { toast } from "sonner";

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add } = useCart();
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setAddonQuantities({});
    setSelectedOptions({});
    setQuantity(1);
    setNotes("");
    
    // Lock body scroll when modal is open
    if (product) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [product?.id]);

  const addonTotal = useMemo(() => {
    if (!product?.addons) return 0;
    let total = 0;
    Object.entries(addonQuantities).forEach(([name, qty]) => {
      const addon = product.addons?.find((a) => a.name === name);
      if (addon) total += addon.price * qty;
    });
    return total;
  }, [product, addonQuantities]);

  const optionsTotal = useMemo(() => {
    let total = 0;
    Object.entries(selectedOptions).forEach(([groupName, selectedNames]) => {
      const group = product?.options?.find(g => g.name === groupName);
      if (group) {
        selectedNames.forEach(name => {
          const item = group.items.find(i => i.name === name);
          if (item) total += item.price;
        });
      }
    });
    return total;
  }, [product, selectedOptions]);

  const isValid = useMemo(() => {
    if (!product?.options) return true;
    for (const group of product.options) {
      if (group.min > 0) {
        const selected = selectedOptions[group.name]?.length || 0;
        if (selected < group.min) return false;
      }
    }
    return true;
  }, [product, selectedOptions]);

  if (!product) return null;
  
  const unit = product.price + addonTotal + optionsTotal;
  const finalTotal = unit * quantity;

  const toggleOption = (groupName: string, itemName: string, max: number) => {
    setSelectedOptions((prev) => {
      const current = prev[groupName] || [];
      if (current.includes(itemName)) {
        return { ...prev, [groupName]: current.filter((n) => n !== itemName) };
      }
      if (current.length >= max) {
        if (max === 1) return { ...prev, [groupName]: [itemName] };
        toast.error(`Máximo de ${max} opções permitidas.`);
        return prev;
      }
      return { ...prev, [groupName]: [...current, itemName] };
    });
  };

  const updateAddon = (name: string, delta: number) => {
    setAddonQuantities((prev) => {
      const next = { ...prev };
      const current = next[name] || 0;
      const newVal = Math.max(0, current + delta);
      if (newVal === 0) delete next[name];
      else next[name] = newVal;
      return next;
    });
  };

  const handleAdd = () => {
    const chosen: typeof product.addons = [];
    Object.entries(addonQuantities).forEach(([name, qty]) => {
      const addon = product.addons?.find((a) => a.name === name);
      if (addon) {
        for (let i = 0; i < qty; i++) chosen.push(addon);
      }
    });

    const chosenOptions: { group: string; name: string; price: number }[] = [];
    Object.entries(selectedOptions).forEach(([groupName, items]) => {
      const group = product.options?.find((g) => g.name === groupName);
      if (group) {
        items.forEach(itemName => {
           const item = group.items.find(i => i.name === itemName);
           if (item) chosenOptions.push({ group: groupName, name: item.name, price: item.price });
        });
      }
    });

    add({
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: unit,
      quantity,
      addons: chosen,
      selectedOptions: chosenOptions,
      notes: notes || undefined,
    });
    toast.success(`${quantity}x ${product.name} adicionado ao carrinho`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white sm:items-center sm:justify-center sm:bg-black/70 sm:p-6 animate-in fade-in duration-200">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-3xl sm:shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="relative shrink-0 bg-white p-4 pb-0">
            <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-[2rem]">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/5" />
              <button
                onClick={onClose}
                aria-label="Voltar"
                className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700"
              >
                &lt; VOLTAR
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center px-6 pt-5 pb-4 text-center">
            <h2 className="text-[22px] font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h2>
            {product.description && (
              <p className="mt-2 text-sm text-gray-600 leading-snug">
                {product.description}
              </p>
            )}
            <div className="mt-3 text-[13px] text-gray-500">a partir de</div>
            <div className="mt-0.5 text-[26px] font-black text-green-700">
              {formatBRL(product.price)}
            </div>
          </div>

          {product.options && product.options.map((group) => {
            const currentSelected = selectedOptions[group.name] || [];
            return (
              <div key={group.name} className="mt-2">
                <div className="bg-[#D9D9D9]/50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm">{group.name}</h3>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        {group.min > 0 ? `Escolha de ${group.min} a ${group.max} opções` : `Escolha até ${group.max} opções`}
                      </p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[9px] font-black tracking-wider text-white ${group.min > 0 ? 'bg-red-600' : 'bg-black'}`}>
                      {group.min > 0 ? 'OBRIGATÓRIO' : 'OPCIONAL'}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-dashed divide-gray-300">
                  {group.items.map((item) => {
                    const isSelected = currentSelected.includes(item.name);
                    return (
                      <label key={item.name} className="flex items-center justify-between bg-white p-4 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input 
                            type={group.max === 1 ? "radio" : "checkbox"} 
                            name={`option_${group.name}`} 
                            checked={isSelected}
                            onChange={() => toggleOption(group.name, item.name, group.max)}
                            className="w-4 h-4 accent-red-600"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-[15px]">{item.name}</span>
                            {item.price > 0 && (
                              <span className="mt-1 text-[13px] font-bold text-green-700">
                                + {formatBRL(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {product.addons && product.addons.length > 0 && (
            <div className="mt-2">
              <div className="bg-[#D9D9D9]/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm">Adicionais</h3>
                    <p className="text-[11px] text-gray-600 mt-0.5">Escolha os itens desejados</p>
                  </div>
                  <span className="rounded bg-black px-2 py-1 text-[9px] font-black tracking-wider text-white">
                    OPCIONAL
                  </span>
                </div>
              </div>
              <div className="divide-y divide-dashed divide-gray-300">
                {product.addons.map((a) => {
                  const qty = addonQuantities[a.name] || 0;
                  return (
                    <div key={a.name} className="flex items-center justify-between bg-white p-4">
                      <div className="flex flex-col pr-4">
                        <span className="font-bold text-gray-800 text-[15px]">{a.name}</span>
                        <span className="mt-1 text-[13px] font-bold text-green-700">
                          + {formatBRL(a.price)}
                        </span>
                      </div>
                      <div className="flex h-9 shrink-0 items-center rounded-full border border-gray-300 bg-white">
                        <button
                          onClick={() => updateAddon(a.name, -1)}
                          className="flex h-full w-10 items-center justify-center text-lg text-gray-500 hover:text-black"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-[15px] font-bold text-gray-800">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateAddon(a.name, 1)}
                          className="flex h-full w-10 items-center justify-center text-lg text-gray-500 hover:text-black"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 px-4 pb-6">
            <h3 className="font-bold text-gray-900 mb-2">Adicionar algum detalhe?</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Excreva o detalhe aqui..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-[15px] placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-4 pb-6 sm:pb-4">
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex h-[46px] shrink-0 items-center rounded-full border border-gray-300 bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-full w-11 items-center justify-center text-xl text-gray-500 hover:text-black"
              >
                −
              </button>
              <span className="w-5 text-center text-base font-bold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-full w-11 items-center justify-center text-xl text-gray-500 hover:text-black"
              >
                +
              </button>
            </div>
            
            <div className="flex-1 text-center whitespace-nowrap px-1">
              <span className="text-[17px] font-black text-green-700">
                {formatBRL(finalTotal)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              disabled={!isValid}
              className="flex h-[46px] shrink-0 items-center justify-center rounded-full bg-[#ff0000] px-6 text-[13px] font-bold tracking-wide text-white shadow-md active:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ADICIONAR
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
