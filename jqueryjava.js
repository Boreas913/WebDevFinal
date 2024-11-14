window.onload = tableDisplay;
function tableDisplay(){
    fetchDefinition("aardwolf");
    fetchDefinition("aardvark");
    fetchDefinition("abaca");
    fetchDefinition("abaft");
}

function searchWord() {
  const word = document.getElementById("wordInput").value;
  if (word) {
    fetchDefinition(word);
  }
}

async function fetchDefinition(word) {
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

//adding words to the table from dictionary with each letter user types
$(document).ready(function(){
  $('#wordInput').on('keyup', function(){
    let word = $(this).val().toLowerCase();
  });
});

//searching what's on the table:
$(document).ready(function() {
    $('#wordInput').on('keyup', function() {
        let searchTerm = $(this).val().toLowerCase();
        $('#dictionaryTable tbody tr').each(function() {
          let row = $(this);
          let rowMatches = false;
          row.find('td').each(function() {
            let cell = $(this);
            let cellText = cell.text().toLowerCase();
            
            // Check if the row contains the search term
            if (cellText.includes(searchTerm) && searchTerm.length > 0) {
              rowMatches = true;
                // Highlight the letter and show row
                let highlightedText = cellText.replace(new RegExp(searchTerm, 'gi'), function(match) {
                    return `<span class="highlight">${match}</span>`;
                });
                    cell.html(highlightedText);
            } else {
                cell.html(cell.text());
            }
          });
          row.toggle(rowMatches);
        });
    });
});  

$(document).ready(function() {
  // Open the modal with slide-in effect
  $('#open-modal-btn').click(function() {
      $('#entrymodal').addClass('show');
  });

  // Close the modal when clicking the close button
  $('#close-modal-btn').click(function() {
      $('#entrymodal').removeClass('show');
  });

});

function closeModal() {
  $('#entrymodal').removeClass('show');
}

$(document).ready(function() {
  // Open the modal with slide-in effect
  $('#add-word-btn').click(function() {
      
  });
});

// Add products to <table>
function Addword() {
  const word = document.getElementById("word").value;
  const speech = document.getElementById("speech").value;
  const definition= document.getElementById("definition").value;
  const tableBody = document.querySelector("#dictionaryTable tbody");

    if (word.length > 0 && speech.length > 0 && definition.length > 0 &&
      (speech == "noun" || speech == "pronoun" || speech == "verb" || 
       speech == "adjective" || speech == "adverb" || 
       speech == "preposition" || speech == "conjunction" || 
       speech == "interjection")) {
        
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${word}</td>
        <td>${speech}</td>
        <td>${definition}</td>
      `;
      tableBody.appendChild(row);
      
      document.getElementById("word").value = '';
      document.getElementById("speech").value = '';
      document.getElementById("definition").value = '';
      
      closeModal();
    }
  else {
    alert("Invalid input. Please make sure all fields are filled and the part of speech is valid.");
  }

}
