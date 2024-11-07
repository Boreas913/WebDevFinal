window.onload = tableDisplay;
function tableDisplay(){
    const initialWords = ["a", "aardvark", "aardwolf", "abaca", "abaft"];
    initialWords.forEach(word => fetchDefinition(word)); //arrow function that assigns it to 'word' for the function
}
$(document).ready(function() {
    $('#wordInput').on('keyup', function() {
        let searchTerm = $(this).val().toLowerCase();
        $('#dictionaryTable tbody tr').each(function() {
            let cellText = $(this).text().toLowerCase();
            let cell = $(this);

            // Check if the row contains the search term
            if (cellText.includes(searchTerm)) {
                // Highlight the letter and show row
                let highlightedText = cellText.replace(new RegExp(searchTerm, 'gi'), function(match) {
                    return `<span class="highlight">${match}</span>`;
                });
                    cell.html(highlightedText);
            } else {
                // Remove the highlight and hide the row
                $(this).removeClass('highlight').hide();
            }
        });
    });
});
  async function fetchDefinition() {
    const word = document.getElementById("wordInput").value;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const tableBody = document.getElementById("dictionaryTable").querySelector("tbody");

    tableBody.innerHTML = ""; // Clear previous results

    try {
      const response = await fetch(url); //fetch data, and wait for response from api, without blocking the rest of the code
      if (!response.ok) throw new Error("Word not found.");
      
      const data = await response.json(); //parses response into java object
      data[0].meanings.forEach(meaning => {
        meaning.definitions.forEach(def => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${data[0].word}</td>
            <td>${meaning.partOfSpeech}</td>
            <td>${def.definition}</td>
          `;
          tableBody.appendChild(row);
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">Error: ${error.message}</td>`;
      tableBody.appendChild(row);
    }
  }   