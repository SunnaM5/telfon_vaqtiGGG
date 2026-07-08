import { motion } from 'motion/react';
import { X, GitCompare } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../data/translations';
import { phoneProducts } from '../data/phones';

interface ComparePanelProps {
  compareList: string[];
  lang: Language;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function ComparePanel({
  compareList,
  lang,
  onRemove,
  onClear,
  onClose,
}: ComparePanelProps) {
  const t = translations[lang];

  // Retrieve products in the comparison list
  const productsToCompare = compareList
    .map((id) => phoneProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  if (productsToCompare.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-black text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
              {lang === 'uz' ? 'Smartfonlarni Solishtirish' : 'Сравнение смартфонов'}
            </h3>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={onClear}
              className="text-[10px] font-bold text-rose-500 hover:underline uppercase font-mono tracking-wider"
            >
              {lang === 'uz' ? 'Tozalash' : 'Очистить'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto flex-1 py-6">
          <table className="w-full min-w-[600px] border-collapse text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-150 dark:border-neutral-800">
                <th className="p-4 text-neutral-400 font-bold uppercase tracking-wider font-mono w-1/4">
                  {lang === 'uz' ? 'Xususiyatlar' : 'Характеристики'}
                </th>
                {productsToCompare.map((p) => (
                  <th key={p.id} className="p-4 w-1/3 relative group">
                    <button
                      onClick={() => onRemove(p.id)}
                      className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title={lang === 'uz' ? 'O‘chirish' : 'Удалить'}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold block uppercase font-mono">{p.brand}</span>
                        <h4 className="font-extrabold text-neutral-900 dark:text-white leading-tight">{p.name}</h4>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price row */}
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/10">
                <td className="p-4 font-bold text-neutral-400">{lang === 'uz' ? 'Narxi' : 'Цена'}</td>
                {productsToCompare.map((p) => (
                  <td key={p.id} className="p-4 font-black text-neutral-900 dark:text-white font-mono text-sm">
                    {p.price.toLocaleString('uz-UZ')} UZS
                  </td>
                ))}
              </tr>

              {/* Display spec */}
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <td className="p-4 font-bold text-neutral-400">{lang === 'uz' ? 'Ekran' : 'Экран'}</td>
                {productsToCompare.map((p) => {
                  const spec = p.specifications.find((s) => s.label.toLowerCase().includes('display') || s.label.toLowerCase().includes('ekran') || s.label.toLowerCase().includes('экран'));
                  return <td key={p.id} className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">{spec ? spec.value : 'N/A'}</td>;
                })}
              </tr>

              {/* Processor spec */}
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/10">
                <td className="p-4 font-bold text-neutral-400">{lang === 'uz' ? 'Protsessor' : 'Процессор'}</td>
                {productsToCompare.map((p) => {
                  const spec = p.specifications.find((s) => s.label.toLowerCase().includes('processor') || s.label.toLowerCase().includes('protsessor') || s.label.toLowerCase().includes('процессор'));
                  return <td key={p.id} className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">{spec ? spec.value : 'N/A'}</td>;
                })}
              </tr>

              {/* Main Camera spec */}
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <td className="p-4 font-bold text-neutral-400">{lang === 'uz' ? 'Asosiy Kamera' : 'Основная камера'}</td>
                {productsToCompare.map((p) => {
                  const spec = p.specifications.find((s) => s.label.toLowerCase().includes('camera') || s.label.toLowerCase().includes('kamera') || s.label.toLowerCase().includes('камера'));
                  return <td key={p.id} className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">{spec ? spec.value : 'N/A'}</td>;
                })}
              </tr>

              {/* Battery spec */}
              <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/10">
                <td className="p-4 font-bold text-neutral-400">{lang === 'uz' ? 'Akkumulyator' : 'Аккумулятор'}</td>
                {productsToCompare.map((p) => {
                  const spec = p.specifications.find((s) => s.label.toLowerCase().includes('battery') || s.label.toLowerCase().includes('akkumulyator') || s.label.toLowerCase().includes('аккумулятор'));
                  return <td key={p.id} className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">{spec ? spec.value : 'N/A'}</td>;
                })}
              </tr>

              {/* RAM/ROM spec */}
              <tr className="border-b border-neutral-100 dark:border-neutral-800">
                <td className="p-4 font-bold text-neutral-400">RAM / ROM</td>
                {productsToCompare.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">
                    RAM: {p.ram.join('/')} / ROM: {p.storage.join('/')}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {productsToCompare.length === 1 && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 rounded-xl text-center text-xs font-semibold mt-4">
            {lang === 'uz' ? 'Solishtirish uchun yana 1 ta smartfon qo‘shing.' : 'Добавьте еще один смартфон для сравнения.'}
          </div>
        )}
      </motion.div>
    </div>
  );
}
