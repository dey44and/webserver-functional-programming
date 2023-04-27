function incarcaPersoane() {
    // Create a new XMLHttpRequest object
    var xhttp = new XMLHttpRequest();

    // Set the HTTP method to GET and the URL of the XML file
    xhttp.open("GET", "resurse/persoane.xml", true);

    // Define a callback function to handle the response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // Parse the response as XML
          var xmlDoc = this.responseXML;
  
          // Get all the "persoana" nodes from the XML document
          var persoane = xmlDoc.getElementsByTagName("persoana");

          // Create table
          var table = document.createElement("table");

          // Create table head
          var thead = document.createElement("thead");
          var row = document.createElement("tr");

          var nume = document.createElement("th");
          nume.textContent = "Nume";

          var prenume = document.createElement("th");
          prenume.textContent = "Prenume";

          var varsta = document.createElement("th");
          varsta.textContent = "Varsta";

          var adresa = document.createElement("th");
          adresa.colSpan = "5";
          adresa.textContent = "Adresa";

          row.append(nume);
          row.append(prenume);
          row.append(varsta);
          row.append(adresa);
          thead.append(row);

          
          // Create table body
          var tbody = document.createElement("tbody");
  
          // Loop through each "persoana" node and create a table row with the data
          for (var i = 0; i < persoane.length; i++) {
            var row = document.createElement("tr");
            
            var nume = document.createElement("td");
            nume.rowSpan = "2";
            nume.textContent = persoane[i].getElementsByTagName("nume")[0].textContent;
            
            var prenume = document.createElement("td");
            prenume.rowSpan = "2";
            prenume.textContent = persoane[i].getElementsByTagName("prenume")[0].textContent;
            
            var varsta = document.createElement("td");
            varsta.rowSpan = "2";
            varsta.textContent = persoane[i].getElementsByTagName("varsta")[0].textContent;

            addresItems = persoane[i].getElementsByTagName("adresa")[0];

            /* Create items and append to adresa */
            var strada = document.createElement("td");
            strada.textContent = "Strada";

            var numar = document.createElement("td");
            numar.textContent = "Numar";

            var localitate = document.createElement("td");
            localitate.textContent = "Localitate";

            var judet = document.createElement("td");
            judet.textContent = "Judet";

            var tara = document.createElement("td");
            tara.textContent = "Tara";
            
            row.appendChild(nume);
            row.appendChild(prenume);
            row.appendChild(varsta);
            row.append(strada);
            row.append(numar);
            row.append(localitate);
            row.append(judet);
            row.append(tara);

            var strada2 = document.createElement("td");
            strada2.textContent = addresItems.getElementsByTagName("strada")[0].textContent;

            var numar2 = document.createElement("td");
            numar2.textContent = addresItems.getElementsByTagName("numar")[0].textContent;

            var localitate2 = document.createElement("td");
            localitate2.textContent = addresItems.getElementsByTagName("localitate")[0].textContent;

            var judet2= document.createElement("td");
            judet2.textContent = addresItems.getElementsByTagName("judet")[0].textContent;
            
            var tara2 = document.createElement("td");
            tara2.textContent = addresItems.getElementsByTagName("tara")[0].textContent;

            var row2 = document.createElement("tr");
            row2.append(strada2);
            row2.append(numar2);
            row2.append(localitate2);
            row2.append(judet2);
            row2.append(tara2);

            tbody.append(row);
            tbody.append(row2);
          }
          table.append(thead);
          table.append(tbody);

          var dummy = document.querySelector("h2");
          document.querySelector("#content").removeChild(dummy);
          document.querySelector("#content").appendChild(table);
        }
      };
  
    // Send the AJAX request
    xhttp.send();
}