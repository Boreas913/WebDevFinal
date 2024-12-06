//starting words for the table
window.onload = tableDisplay;
function tableDisplay(){
    fetchDefinition("aardwolf");
    fetchDefinition("aardvark");
    fetchDefinition("abaca");
    fetchDefinition("abaft");
}

//fill table with data after searching a word
function searchWord() {
  const word = document.getElementById("wordInput").value;
  if (word) {
    fetchDefinition(word);
  }
}
//using the api
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
          <td><button onclick="deleteData(this)">Delete</button>
          <button onclick="edit(this)">Edit</button>
          <td>
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

//searching what's on the table:
$(document).ready(function() {
  $('#wordInput').on('keyup', function() {
    let searchTerm = $(this).val().toLowerCase();
    
    $('#dictionaryTable tbody tr').each(function() {
      let row = $(this);
      let rowMatches = false;

      // If the search term is empty, show all rows
      if (searchTerm.length === 0) {
        row.show();
        row.find('td').each(function() {
          let cell = $(this);
          cell.html(cell.text()); 
        });
        return;
      }

      row.find('td').each(function() {
        let cell = $(this);
        let cellText = cell.text().toLowerCase();
        
        if (cellText.includes(searchTerm)) {
          rowMatches = true;

          // Highlight the matching text
          let highlightedText = cellText.replace(new RegExp(searchTerm, 'gi'), function(match) {
            return `<span class="highlight">${match}</span>`;
          });
          cell.html(highlightedText);
        } else {
          cell.html(cell.text()); // Reset if no match
        }
      });

      row.toggle(rowMatches); // Show/hide the row based on matches
    });
  });
});

// Add products to <table>:
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
    showPopup('Invalid input. Please make sure all fields are filled and the part of speech is valid.', 'success');
  }

}

//Sort column by clicking the header
function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("dictionaryTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

//edit the row the button is in by clicking it
function edit(button) {
  // Show the modal
  $('#editmodal').addClass('show');

  // Close button functionality
  $('#close-editmodal-btn').off('click').click(function () {
    $('#editmodal').removeClass('show');
  });

  // Get the parent row of the clicked button
  let row = button.parentNode.parentNode;

  // Get the cells within the row
  let wordCell = row.cells[0];
  let speechCell = row.cells[1];
  let defCell = row.cells[2];

  // Get input fields
  let wordInput = document.getElementById("editword");
  let speechInput = document.getElementById("editspeech");
  let defInput = document.getElementById("editdefinition");

  // Set values in the input fields
  wordInput.value = wordCell.innerText;
  speechInput.value = speechCell.innerText;
  defInput.value = defCell.innerText;

  // Handle form submission
  document.querySelector('#editForm').onsubmit = function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get updated values from input fields
    let updatedWord = wordInput.value.trim();
    let updatedSpeech = speechInput.value.trim();
    let updatedDef = defInput.value.trim();

    // Validate inputs
    if (updatedWord && updatedSpeech && updatedDef) {
      // Update the table cells with new values
      wordCell.innerText = updatedWord;
      speechCell.innerText = updatedSpeech;
      defCell.innerText = updatedDef;

      // Close the modal
      $('#editmodal').removeClass('show');

      // Show success popup
      showPopup('Entry edited', 'success');
    } else {
      // Show error popup if any field is empty
      showPopup('Edit failed', 'success');
    }
  };
}

//delete the row by clicking the delete button thats in it
function deleteData(button) {
  // Get the parent row of the clicked button
  let row = button.parentNode.parentNode;
  // Remove the row from the table
  row.parentNode.removeChild(row);
  showPopup('Entry Deleted', 'success');
}

//message to show user if the function failed or not
function showPopup(message, type) {
  // Set the message and class
  $('#popup').text(message).removeClass('success').addClass(type);
  // Show the pop-up
  $('#popup').fadeIn().delay(1000).fadeOut();
}

//opening and closing the modal for editing and creating:
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