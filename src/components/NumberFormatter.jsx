import React from "react";

const NumberFormatter = ({ value, locale = "en-US" }) => {
  const formatNumber = (number) => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  return <span>{formatNumber(value)}</span>;
};

export default NumberFormatter;
