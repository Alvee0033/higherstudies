const unwrap = value => value && typeof value === 'object' && 'func' in value ? value.func : value;

export function readTuition(value) {
  const entries = unwrap(value);
  if (!Array.isArray(entries)) return [];
  const fees = entries.flatMap(entry => {
    const fee = unwrap(entry);
    const rawAmount = unwrap(fee?.getAmount ?? fee?.amount);
    const amount = unwrap(fee?.isFree) === true ? 0 : rawAmount;
    const currency = unwrap(fee?.getCurrency ?? fee?.currency);
    const unit = unwrap(fee?.getUnit ?? fee?.unit);
    if (amount === null || amount === undefined || amount === '' || !Number.isFinite(Number(amount)) || Number(amount) < 0 || typeof currency !== 'string' || !/^[A-Z]{3}$/i.test(currency)) return [];
    return [{ amount: Number(amount), currency: currency.toUpperCase(), unit: typeof unit === 'string' ? unit : null }];
  });
  return [...new Map(fees.map(fee => [JSON.stringify(fee), fee])).values()];
}
