/**
 * Data formatting utilities
 */

export class DataFormatters {
  /**
   * Format distance in meters to human readable format
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters.toFixed(0)}м`;
    }
    return `${(meters / 1000).toFixed(1)}км`;
  }

  /**
   * Format fuel amount with appropriate unit
   */
  static formatFuel(liters: number): string {
    if (liters < 1) {
      return `${(liters * 1000).toFixed(0)}мл`;
    }
    return `${liters.toFixed(1)}л`;
  }

  /**
   * Format speed with unit
   */
  static formatSpeed(kmh: number): string {
    return `${kmh.toFixed(1)} км/год`;
  }

  /**
   * Format engine RPM
   */
  static formatRpm(rpm: number): string {
    return `${rpm.toLocaleString()} об/хв`;
  }

  /**
   * Format temperature with unit
   */
  static formatTemperature(celsius: number): string {
    return `${celsius.toFixed(1)}°C`;
  }

  /**
   * Format percentage
   */
  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Format engine hours
   */
  static formatEngineHours(hours: number): string {
    if (hours < 1) {
      return `${(hours * 60).toFixed(0)}хв`;
    }
    return `${hours.toFixed(1)}год`;
  }

  /**
   * Format work area in hectares
   */
  static formatArea(hectares: number): string {
    if (hectares < 1) {
      return `${(hectares * 10000).toFixed(0)}м²`;
    }
    return `${hectares.toFixed(2)}га`;
  }

  /**
   * Format currency amount
   */
  static formatCurrency(amount: number, currency: string = 'UAH'): string {
    const formatter = new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    });
    return formatter.format(amount);
  }

  /**
   * Format vehicle status for display
   */
  static formatVehicleStatus(status: string): { text: string; color: string } {
    switch (status) {
      case 'online':
        return { text: 'В мережі', color: 'text-green-600' };
      case 'offline':
        return { text: 'Поза мережею', color: 'text-gray-500' };
      case 'warning':
        return { text: 'Попередження', color: 'text-yellow-600' };
      case 'maintenance':
        return { text: 'Обслуговування', color: 'text-blue-600' };
      case 'idle':
        return { text: 'Простій', color: 'text-gray-400' };
      default:
        return { text: 'Невідомо', color: 'text-gray-400' };
    }
  }

  /**
   * Format coordinates for display
   */
  static formatCoordinates(lat: number, lng: number): string {
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
  }

  /**
   * Format efficiency score
   */
  static formatEfficiency(score: number): { text: string; color: string } {
    if (score >= 90) return { text: 'Відмінно', color: 'text-green-600' };
    if (score >= 80) return { text: 'Добре', color: 'text-green-500' };
    if (score >= 70) return { text: 'Задовільно', color: 'text-yellow-600' };
    if (score >= 60) return { text: 'Потребує покращення', color: 'text-orange-600' };
    return { text: 'Незадовільно', color: 'text-red-600' };
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    if (bytes === 0) return '0 Б';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  /**
   * Format phone number in Ukrainian format
   */
  static formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a Ukrainian number
    if (cleaned.startsWith('380')) {
      const number = cleaned.substring(3);
      return `+380 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
    }
    
    return phone; // Return as-is if not Ukrainian format
  }
}