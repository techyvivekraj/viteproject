export const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('expiration_time');
    if (!expirationTime) {
      return true;
    }
    return new Date().getTime() > parseInt(expirationTime, 10);
  };
  
  export function capitalizeFirstLetter(word) {
    if (typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  export const formatNumber = (num) => {
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    // if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toString();
  };