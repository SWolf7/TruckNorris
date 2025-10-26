//File to import into the User Dashboards 
export function downloadCSVFromJSON(jsonData, filename = 'data.csv') {
    //checks if the JSON is empty, if it is return and log the error.
    if (!jsonData || !jsonData.length) {
      console.error('No data to export');
      return;
    }
    //replaces any "null" value with an empty string for the CSV file.
    const replacer = (key, value) => (value === null ? '' : value);
    //grabs the keys from the first object in the array
    const header = Object.keys(jsonData[0]);
  
    //build into a csv format.
    const csv = [
      header.join(','), // header row
      ...jsonData.map(row =>
        header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',')
      ),
    ].join('\r\n');
    //blobl is a file like object used for storing the bianry data.
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
  
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  