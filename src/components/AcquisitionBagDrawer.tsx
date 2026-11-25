import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { BagLineItem } from '../types/navigation';

interface AcquisitionBagDrawerProps {
  open: boolean;
  isWhitePage?: boolean;
  items: BagLineItem[];
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearBag: () => void;
  onNotify: (msg: string) => void;
  paymentTermsNotice?: string;
}

const KIND_LABELS: Record<BagLineItem['kind'], string> = {
  vehicle: 'Showroom Vehicle',
  part: 'Garage Hardware',
  exclusive: 'Exclusive Vault',
  service: 'Service Allocation',
};

export const AcquisitionBagDrawer: React.FC<AcquisitionBagDrawerProps> = ({
  open,
  isWhitePage = false,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
  onNotify,
  paymentTermsNotice,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const subtotal = items.reduce((acc, item) => acc + item.priceUsd * item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !clientName.trim() || !clientPhone.trim()) return;
    const orderNum = `FP-${Math.floor(100000 + Math.random() * 899999)}`;
    setConfirmedOrderId(orderNum);
    onClearBag();
    onNotify(`Reservation #${orderNum} Confirmed`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex justify-end"
          onClick={onClose}
        >
          <motion.aside
            aria-label="Acquisition Bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md h-full border-l flex flex-col justify-between overflow-hidden shadow-2xl ${
              isWhitePage
                ? 'bg-white text-[#11100e] border-[#e5e2da]'
                : 'bg-[#0e0c0a] text-[#f4f1ea] border-[#e5c158]/20'
            }`}
          >
            {/* Header */}
            <div
              className={`px-5 py-4 border-b flex items-center justify-between gap-3 ${
                isWhitePage ? 'border-[#e5e2da]' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag
                  className={`w-5 h-5 ${isWhitePage ? 'text-[#9b7218]' : 'text-[#e5c158]'}`}
                />
                <div>
                  <h2 className="font-display text-base font-extrabold uppercase tracking-wider">
                    Acquisition Bag
                  </h2>
                  <span
                    className={`text-[11px] font-mono-tech ${
                      isWhitePage ? 'text-[#5b564c]' : 'text-[#a59b84]'
                    }`}
                  >
                    {items.reduce((n, i) => n + i.quantity, 0)} Item(s) Selected
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close acquisition bag"
                onClick={() => {
                  setConfirmedOrderId(null);
                  onClose();
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isWhitePage
                    ? 'bg-[#f4f2ec] hover:bg-[#11100e] hover:text-white text-[#11100e]'
                    : 'bg-white/10 hover:bg-[#e5c158] hover:text-[#080706] text-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {confirmedOrderId ? (
                <div
                  className={`py-10 px-4 text-center space-y-4 rounded-2xl border ${
                    isWhitePage
                      ? 'bg-[#faf9f6] border-[#e5e2da]'
                      : 'obsidian-panel border-[#e5c158]/25'
                  }`}
                >
                  <CheckCircle2
                    className={`w-12 h-12 mx-auto ${
                      isWhitePage ? 'text-[#9b7218]' : 'text-[#e5c158]'
                    }`}
                  />
                  <div
                    className={`text-xs font-mono-tech uppercase tracking-wider ${
                      isWhitePage ? 'text-[#9b7218]' : 'text-[#e5c158]'
                    }`}
                  >
                    Order #{confirmedOrderId} Confirmed
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    Reservation Received by Imperion Desk
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      isWhitePage ? 'text-[#5b564c]' : 'text-[#a59b84]'
                    }`}
                  >
                    Thank you, {clientName}. Our acquisition coordinator will reach out at{' '}
                    <strong>{clientPhone}</strong> to finalize inspection sheets and insured delivery to{' '}
                    <strong>{deliveryCity || 'your location'}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedOrderId(null);
                      onClose();
                    }}
                    className={`px-5 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider cursor-pointer ${
                      isWhitePage
                        ? 'bg-[#11100e] text-white hover:bg-[#9b7218]'
                        : 'bg-[#e5c158] text-[#080706]'
                    }`}
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <p className="font-display text-lg font-bold">Your Bag is Empty</p>
                  <p
                    className={`text-xs max-w-xs mx-auto ${
                      isWhitePage ? 'text-[#5b564c]' : 'text-[#a59b84]'
                    }`}
                  >
                    Add available vehicles from the Showroom or forged parts from the Garage to place an inquiry or reservation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex gap-3.5 items-start ${
                        isWhitePage
                          ? 'bg-[#faf9f6] border-[#e5e2da]'
                          : 'bg-[#14110e] border-white/10'
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-xl object-cover shrink-0 border border-black/10"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-[10px] font-mono-tech uppercase block ${
                            isWhitePage ? 'text-[#9b7218]' : 'text-[#e5c158]'
                          }`}
                        >
                          {KIND_LABELS[item.kind] || 'Collection Item'} · {item.grade}
                        </span>
                        <h4 className="font-display text-sm font-bold truncate mt-0.5">
                          {item.title}
                        </h4>
                        <div
                          className={`text-[11px] truncate ${
                            isWhitePage ? 'text-[#5b564c]' : 'text-[#a59b84]'
                          }`}
                        >
                          {item.subtitle}
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-2.5">
                          <span
                            className={`font-mono-tech text-sm font-bold tabular-nums ${
                              isWhitePage ? 'text-[#9b7218]' : 'text-[#e5c158]'
                            }`}
                          >
                            ${(item.priceUsd * item.quantity).toLocaleString('en-US')}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {item.kind === 'part' && (
                              <div
                                className={`flex items-center rounded-lg border ${
                                  isWhitePage
                                    ? 'bg-white border-[#dedad0]'
                                    : 'bg-[#080706] border-white/10'
                                }`}
                              >
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() => onUpdateQty(item.id, -1)}
                                  className="p-1.5 hover:opacity-70 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-mono-tech">{item.quantity}</span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() => onUpdateQty(item.id, 1)}
                                  className="p-1.5 hover:opacity-70 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1.5 rounded-lg text-[#7d7668] hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Checkout Form */}
            {!confirmedOrderId && items.length > 0 && (
              <form
                onSubmit={handleCheckoutSubmit}
                className={`p-5 border-t space-y-3 ${
                  isWhitePage
                    ? 'border-[#e5e2da] bg-[#faf9f6]'
                    : 'border-white/10 bg-[#12100d]'
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-xs font-mono-tech uppercase tracking-wider ${
                      isWhitePage ? 'text-[#5b564c]' : 'text-[#a59b84]'
                    }`}
                  >
                    Estimated Total
                  </span>
                  <span
                    className={`font-mono-tech text-xl font-bold tabular-nums ${
                      isWhitePage ? 'text-[#9b7218]' : 'text-[#e5c158]'
                    }`}
                  >
                    ${subtotal.toLocaleString('en-US')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Full Name *"
                    className={`w-full min-h-[40px] rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                      isWhitePage
                        ? 'bg-white border-[#dedad0] text-[#11100e] focus:border-[#9b7218]'
                        : 'bg-[#080706] border-white/15 text-white focus:border-[#e5c158]'
                    }`}
                  />
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Phone / WhatsApp *"
                    className={`w-full min-h-[40px] rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                      isWhitePage
                        ? 'bg-white border-[#dedad0] text-[#11100e] focus:border-[#9b7218]'
                        : 'bg-[#080706] border-white/15 text-white focus:border-[#e5c158]'
                    }`}
                  />
                </div>

                <input
                  type="text"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  placeholder="Delivery City or Escrow Request"
                  className={`w-full min-h-[40px] rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                    isWhitePage
                      ? 'bg-white border-[#dedad0] text-[#11100e] focus:border-[#9b7218]'
                      : 'bg-[#080706] border-white/15 text-white focus:border-[#e5c158]'
                  }`}
                />

                {paymentTermsNotice && (
                  <p
                    className={`text-[11px] leading-relaxed ${
                      isWhitePage ? 'text-[#5b564c]' : 'text-[#a59b84]'
                    }`}
                  >
                    {paymentTermsNotice}
                  </p>
                )}

                <button
                  type="submit"
                  className={`w-full min-h-[44px] py-3 rounded-xl font-display text-xs font-bold uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                    isWhitePage
                      ? 'bg-[#11100e] hover:bg-[#9b7218] text-white'
                      : 'bg-[#e5c158] hover:bg-white text-[#080706]'
                  }`}
                >
                  Confirm Reservation Request
                </button>
              </form>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
