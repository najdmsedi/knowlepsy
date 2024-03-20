class UtilsDate {
    static formatDDMMYYYY(date) {
      if (!date) {
        return "";
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  
    static formatHHMMSS(date) {
      if (!date) {
        return null;
      }
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
  
    static formatHHmmDDMMYYYY(date) {
      if (!date) {
        return "";
      }
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
  
    static formatYYYYMMDD(date) {
      if (!date) {
        return null;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  
    static formatDuration(duration) {
      return `${String(duration.minutes).padStart(2, '0')}:${String(duration.seconds % 60).padStart(2, '0')}`;
    }
  
    static async getDate() {
      const now = new Date();
      return now;
    }
  }
  
  export default UtilsDate;