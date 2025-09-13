/**
 * Date and time utility functions
 */

export class DateUtils {
  /**
   * Format date for Ukrainian locale
   */
  static formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString('uk-UA', { ...defaultOptions, ...options });
  }

  /**
   * Format time for Ukrainian locale
   */
  static formatTime(date: Date, includeSeconds: boolean = false): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };

    if (includeSeconds) {
      options.second = '2-digit';
    }

    return date.toLocaleTimeString('uk-UA', options);
  }

  /**
   * Format datetime for Ukrainian locale
   */
  static formatDateTime(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  static getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return 'щойно';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${this.getPluralForm(diffMinutes, 'хвилину', 'хвилини', 'хвилин')} тому`;
    } else if (diffHours < 24) {
      return `${diffHours} ${this.getPluralForm(diffHours, 'годину', 'години', 'годин')} тому`;
    } else if (diffDays < 30) {
      return `${diffDays} ${this.getPluralForm(diffDays, 'день', 'дні', 'днів')} тому`;
    } else {
      return this.formatDate(date);
    }
  }

  /**
   * Get Ukrainian plural form
   */
  private static getPluralForm(n: number, form1: string, form2: string, form5: string): string {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 19) {
      return form5;
    }

    if (mod10 === 1) {
      return form1;
    }

    if (mod10 >= 2 && mod10 <= 4) {
      return form2;
    }

    return form5;
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Check if date is yesterday
   */
  static isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  /**
   * Get start of day for given date
   */
  static getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Get end of day for given date
   */
  static getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Get date range for common periods
   */
  static getDateRange(period: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth'): {
    start: Date;
    end: Date;
  } {
    const now = new Date();
    const today = this.getStartOfDay(now);
    const endOfToday = this.getEndOfDay(now);

    switch (period) {
      case 'today':
        return { start: today, end: endOfToday };

      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: this.getEndOfDay(yesterday) };

      case 'thisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
        return { start: startOfWeek, end: endOfToday };

      case 'lastWeek':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 6); // Last Monday
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekEnd.getDate() + 6); // Last Sunday
        return { start: lastWeekStart, end: this.getEndOfDay(lastWeekEnd) };

      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: startOfMonth, end: endOfToday };

      case 'lastMonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start: lastMonthStart, end: this.getEndOfDay(lastMonthEnd) };

      default:
        return { start: today, end: endOfToday };
    }
  }

  /**
   * Format duration in human readable form
   */
  static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}д ${hours % 24}г`;
    } else if (hours > 0) {
      return `${hours}г ${minutes % 60}хв`;
    } else if (minutes > 0) {
      return `${minutes}хв ${seconds % 60}с`;
    } else {
      return `${seconds}с`;
    }
  }

  /**
   * Add days to date
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Add hours to date
   */
  static addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setTime(result.getTime() + hours * 60 * 60 * 1000);
    return result;
  }

  /**
   * Check if date is within range
   */
  static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  /**
   * Get business days between two dates (excluding weekends)
   */
  static getBusinessDaysBetween(startDate: Date, endDate: Date): number {
    let count = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }
}