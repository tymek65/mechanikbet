const CustomDonationInput = ({ name, value, min, max, step, onChange, className }) => (
  <>
    <input className={className} type="range" name={name} value={value} min={min} max={max} step={step} onChange={onChange}></input>
  </>
);

export default CustomDonationInput;
