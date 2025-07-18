export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';

  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.length === 13 && cleaned.startsWith('447')) {
    const mobilePrefix = cleaned.substring(2, 6); // 7xxx
    const firstPart = cleaned.substring(6, 9);
    const secondPart = cleaned.substring(9, 13);

    return `0${mobilePrefix} ${firstPart} ${secondPart}`;
  }

  if (cleaned.length === 12 && cleaned.startsWith('447')) {
    const mobilePrefix = cleaned.substring(2, 6); // 7xxx
    const firstPart = cleaned.substring(6, 9);
    const secondPart = cleaned.substring(9, 12);

    return `0${mobilePrefix} ${firstPart} ${secondPart}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('07')) {
    const mobilePrefix = cleaned.substring(0, 5); // 07xxx
    const firstPart = cleaned.substring(5, 8);
    const secondPart = cleaned.substring(8, 11);

    return `${mobilePrefix} ${firstPart} ${secondPart}`;
  }

  if (cleaned.length === 10 && cleaned.startsWith('7')) {
    const mobilePrefix = '0' + cleaned.substring(0, 4); // 07xxx
    const firstPart = cleaned.substring(4, 7);
    const secondPart = cleaned.substring(7, 10);

    return `${mobilePrefix} ${firstPart} ${secondPart}`;
  }

  return phoneNumber;
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber) return false;

  const cleaned = phoneNumber.replace(/\D/g, '');

  return (
    (cleaned.length === 11 && cleaned.startsWith('07')) ||
    (cleaned.length === 12 && cleaned.startsWith('447')) ||
    (cleaned.length === 13 && cleaned.startsWith('447')) ||
    (cleaned.length === 10 && cleaned.startsWith('7'))
  );
};
