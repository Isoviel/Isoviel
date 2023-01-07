// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
//const { get } = require("jquery");

// Write your JavaScript code.

var animalRecords;
var totalAnimals;
var currentAnimal = 0;
var priorAnimal = 0;
var dirtyFlag;
var tempImage;
var searchFieldIds = [
	'animalName',
	'animalIDNumber',
	'animalCommonName',
	'animalGenus',
	'animalSpecies']
var resultFieldIds = [
	'editAnimalName',
	'editAnimalIDNumber',
	'editMicrochipNumber',
	'editCommonName',
	'editGenus',
	'editSpecies',
	'editDateAquired',
	'editSex',
	'editDateOfBirth',
	'editDonor',
	'editOwnership',
	'editNotes',
	'editWeight',
	'editLastFeeding',
	'editLastShed',
	'editMedication',
	'editMedicalNotes',
	'editDeceased',
	'editDateDeceased',
	'editAnimalDiet',
	'editAnimalImage'];
var nextAnimalIDNumber;



function DisplayAnimal(sequenceNumber) {
	document.getElementById("editAnimalName").value = "";
	document.getElementById("editAnimalIDNumber").value = nextAnimalIDNumber;
	document.getElementById("editMicrochipNumber").value = "";
	document.getElementById("editCommonName").value = "";
	document.getElementById("editGenus").value = "";
	document.getElementById("editSpecies").value = "";
	document.getElementById("editDateAquired").value = "";
	document.getElementById("editSex").value = "";
	document.getElementById("editDateOfBirth").value = "";
	document.getElementById("editDonor").value = "";
	document.getElementById("editOwnership").value = "";
	document.getElementById("editNotes").value = "";
	document.getElementById("editDeceased").checked = false;
	document.getElementById("editWeight").value = "";
	document.getElementById("editLastFeeding").value = "";
	document.getElementById("editLastShed").value = "";
	document.getElementById("editMedication").value = "";
	document.getElementById("editMedicalNotes").value = "";
	document.getElementById("editDateDeceased").value = "";
	document.getElementById("editAnimalDiet").value = "";
	document.getElementById("editAnimalImage").src = "";
	if (totalAnimals > 0 && sequenceNumber >= 0) {
		document.getElementById("editAnimalName").value = animalRecords[sequenceNumber].Name;
		document.getElementById("editAnimalIDNumber").value = animalRecords[sequenceNumber].AnimalIDNumber;
		document.getElementById("editMicrochipNumber").value = animalRecords[sequenceNumber].MicrochipNumber;
		document.getElementById("editCommonName").value = animalRecords[sequenceNumber].CommonName;
		document.getElementById("editGenus").value = animalRecords[sequenceNumber].Genus;
		document.getElementById("editSpecies").value = animalRecords[sequenceNumber].Species;
		document.getElementById("editDateAquired").value = animalRecords[sequenceNumber].DateAquired;
		document.getElementById("editSex").value = animalRecords[sequenceNumber].Sex;
		document.getElementById("editDateOfBirth").value = animalRecords[sequenceNumber].DateOfBirth;
		document.getElementById("editDonor").value = animalRecords[sequenceNumber].Donor;
		document.getElementById("editOwnership").value = animalRecords[sequenceNumber].Ownership;
		document.getElementById("editNotes").value = animalRecords[sequenceNumber].Notes;
		document.getElementById("editDeceased").checked = animalRecords[sequenceNumber].Deceased;
		document.getElementById("editWeight").value = animalRecords[sequenceNumber].Weight;
		document.getElementById("editLastFeeding").value = animalRecords[sequenceNumber].LastFeed;
		document.getElementById("editLastShed").value = animalRecords[sequenceNumber].LastShed;
		document.getElementById("editMedication").value = animalRecords[sequenceNumber].MedicationGiven;
		document.getElementById("editMedicalNotes").value = animalRecords[sequenceNumber].MedicalNotes;
		document.getElementById("editDateDeceased").value = animalRecords[sequenceNumber].DateDeceased;
		document.getElementById("editAnimalDiet").value = animalRecords[sequenceNumber].AnimalDiet;
		document.getElementById("editAnimalImage").src = animalRecords[sequenceNumber].AnimalImage;
	}
}

function Scrub() {
	dirtyFlag = false;
	document.getElementById("addbutton").disabled = false;
	if (currentAnimal && currentAnimal != 0) {
		document.getElementById("previousbutton").disabled = false;
	}
	if (animalRecords) {
		if (currentAnimal != animalRecords.length - 1) {
			document.getElementById("nextbutton").disabled = false;
		}
		if (animalRecords.length <= 1) {
			document.getElementById("previousbutton").disabled = true;
			document.getElementById("nextbutton").disabled = true;
		}
	} else {
		document.getElementById("previousbutton").disabled = true;
		document.getElementById("nextbutton").disabled = true;
	}
	document.getElementById("searchbutton").disabled = false;
	document.getElementById("savebutton").disabled = true;
	document.getElementById("cancelbutton").disabled = true;
}

function NextAnimal() {
	currentAnimal++;
	priorAnimal = currentAnimal;
	DisplayAnimal(currentAnimal);
	document.getElementById("previousbutton").disabled = false
	if (currentAnimal == animalRecords.length - 1) {
		document.getElementById("nextbutton").disabled = true
	}
	Scrub();
}
function PreviousAnimal() {
	currentAnimal--;
	priorAnimal = currentAnimal;
	DisplayAnimal(currentAnimal);
	document.getElementById("nextbutton").disabled = false
	if (currentAnimal == 0) {
		document.getElementById("previousbutton").disabled = true
	}
	Scrub();
}
function AddAnimal() {
	priorAnimal = currentAnimal;
	currentAnimal = -1;
	GetNextAnimalIDNumber();
}
function GetNextAnimalIDNumber() {
	var req = new XMLHttpRequest();

	req.timeout = 1200000;
	req.open('GET', './search.ashx?command=getnextanimalidnumber');
	req.setRequestHeader('Content-Type', 'application/json');
	req.onload = () => {
		// Check the status.
		if (req.status === 200) {
			/*alert(req.response);*/
			nextAnimalIDNumber = JSON.parse(req.response);
			DisplayAnimal(currentAnimal);
			Dirtify();
		} else {
			alert(req.statusText);
		}
	};
	// Network errors.
	req.onerror = () => {
		alert('Network error.');
	};
	// Make the request.
	req.send();
}
function CancelChange() {
	currentAnimal = priorAnimal;
	DisplayAnimal(currentAnimal);
	Scrub();
}

function SaveAnimal() {
	if (currentAnimal != -1) {
		var animalEdit = new AnimalEdit(
			parseInt(animalRecords[currentAnimal].ID),
			document.getElementById("editAnimalName").value,
			parseInt(document.getElementById("editAnimalIDNumber").value),
			document.getElementById("editMicrochipNumber").value,
			document.getElementById("editCommonName").value,
			document.getElementById("editGenus").value,
			document.getElementById("editSpecies").value,
			document.getElementById("editDateAquired").value,
			document.getElementById("editSex").value,
			document.getElementById("editDateOfBirth").value,
			document.getElementById("editDonor").value,
			document.getElementById("editOwnership").value,
			document.getElementById("editNotes").value,
			document.getElementById("editDeceased").checked,
			document.getElementById("editWeight").value,
			document.getElementById("editLastFeeding").value,
			document.getElementById("editLastShed").value,
			document.getElementById("editMedication").value,
			document.getElementById("editMedicalNotes").value,
			document.getElementById("editDateDeceased").value,
			document.getElementById("editAnimalDiet").value,
			tempImage
		)
	} else {
		var animalEdit = new AnimalEdit(
			-1,
			document.getElementById("editAnimalName").value,
			parseInt(document.getElementById("editAnimalIDNumber").value),
			document.getElementById("editMicrochipNumber").value,
			document.getElementById("editCommonName").value,
			document.getElementById("editGenus").value,
			document.getElementById("editSpecies").value,
			document.getElementById("editDateAquired").value,
			document.getElementById("editSex").value,
			document.getElementById("editDateOfBirth").value,
			document.getElementById("editDonor").value,
			document.getElementById("editOwnership").value,
			document.getElementById("editNotes").value,
			document.getElementById("editDeceased").checked,
			document.getElementById("editWeight").value,
			document.getElementById("editLastFeeding").value,
			document.getElementById("editLastShed").value,
			document.getElementById("editMedication").value,
			document.getElementById("editMedicalNotes").value,
			document.getElementById("editDateDeceased").value,
			document.getElementById("editAnimalDiet").value,
			tempImage
		)
	}
	Scrub();

	var animalBody = JSON.stringify(animalEdit);
	var newID = SaveData("./edit.ashx", animalBody);
	if (currentAnimal == -1) {
		currentAnimal = animalRecords.push(new Object) - 1;
	}
	animalRecords[currentAnimal.ID] = newID;
	animalRecords[currentAnimal].Name = document.getElementById("editAnimalName").value;
	animalRecords[currentAnimal].AnimalIDNumber = document.getElementById("editAnimalIDNumber").value;
	animalRecords[currentAnimal].MicrochipNumber = document.getElementById("editMicrochipNumber").value;
	animalRecords[currentAnimal].CommonName = document.getElementById("editCommonName").value;
	animalRecords[currentAnimal].Genus = document.getElementById("editGenus").value;
	animalRecords[currentAnimal].Species = document.getElementById("editSpecies").value;
	animalRecords[currentAnimal].DateAquired = document.getElementById("editDateAquired").value;
	animalRecords[currentAnimal].Sex = document.getElementById("editSex").value;
	animalRecords[currentAnimal].DateOfBirth = document.getElementById("editDateOfBirth").value;
	animalRecords[currentAnimal].Donor = document.getElementById("editDonor").value;
	animalRecords[currentAnimal].Ownership = document.getElementById("editOwnership").value;
	animalRecords[currentAnimal].Notes = document.getElementById("editNotes").value;
	animalRecords[currentAnimal].Deceased = document.getElementById("editDeceased").checked;
	animalRecords[currentAnimal].Weight = document.getElementById("editWeight").value;
	animalRecords[currentAnimal].LastFeed = document.getElementById("editLastFeeding").value;
	animalRecords[currentAnimal].LastShed = document.getElementById("editLastShed").value;
	animalRecords[currentAnimal].MedicationGiven = document.getElementById("editMedication").value;
	animalRecords[currentAnimal].MedicalNotes = document.getElementById("editMedicalNotes").value;
	animalRecords[currentAnimal].DateDeceased = document.getElementById("editDateDeceased").value;
	animalRecords[currentAnimal].AnimalDiet = document.getElementById("editAnimalDiet").value;
	animalRecords[currentAnimal].AnimalImage = document.getElementById("editAnimalImage").src;
}

class AnimalSearch {
	constructor(name, animalIDNumber, commonName, genus, species) {
		this.name = name;
		this.animalIDNumber = animalIDNumber;
		this.commonName = commonName;
		this.genus = genus;
		this.species = species;
	}
}

class AnimalEdit {
	constructor(
		ID,
		name,
		animalIDNumber,
		microchipNumber,
		commonName,
		genus,
		species,
		dateAquired,
		sex,
		dateOfBirth,
		donor,
		ownership,
		notes,
		deceased,
		weight,
		lastFeed,
		lastShed,
		medicationGiven,
		medicalNotes,
		dateDeceased,
		animalDiet,
		animalImage
	) {
		this.ID = ID;
		this.name = name;
		this.animalIDNumber = animalIDNumber;
		this.microchipNumber = microchipNumber;
		this.commonName = commonName;
		this.genus = genus;
		this.species = species;
		this.dateAquired = dateAquired;
		this.sex = sex;
		this.dateOfBirth = dateOfBirth;
		this.donor = donor;
		this.ownership = ownership;
		this.notes = notes;
		this.deceased = deceased;
		this.weight = weight;
		this.lastFeed = lastFeed;
		this.lastShed = lastShed;
		this.medicationGiven = medicationGiven;
		this.medicalNotes = medicalNotes;
		this.dateDeceased = dateDeceased;
		this.animalDiet = animalDiet;
		this.animalImage = animalImage;
	}
}

function LoadAnimal() {
	var animalSearch = new AnimalSearch(
		document.getElementById("animalName").value,
		parseInt(document.getElementById("animalIDNumber").value),
		document.getElementById("animalCommonName").value,
		document.getElementById("animalGenus").value,
		document.getElementById("animalSpecies").value);
	var animalBody = JSON.stringify(animalSearch);

	GetAnimal("./search.ashx", animalBody);
}

function GetAnimal(url, data) {
	var req = new XMLHttpRequest();

	req.timeout = 1200000;
	req.open('POST', url);
	req.setRequestHeader('Content-Type', 'application/json');
	req.onload = () => {
		// Check the status.
		if (req.status === 200) {
			/*alert(req.response);*/
			console.log(req.response);
			animalRecords = JSON.parse(req.response);
			totalAnimals = animalRecords.length;
			priorAnimal = 0;
			currentAnimal = 0;
			DisplayAnimal(currentAnimal);
			Scrub();
		} else {
			alert(req.statusText);
		}
	};
	// Network errors.
	req.onerror = () => {
		alert('Network error.');
	};
	// Make the request.
	req.send(data);
}

function SaveData(url, data) {
	var req = new XMLHttpRequest();

	req.timeout = 1200000;
	req.open('POST', url);
	req.setRequestHeader('Content-Type', 'application/json');
	req.onload = () => {
		// Check the status.
		if (req.status === 200) {
			/*alert(req.response);*/
			//animalRecords = JSON.parse(req.response);
			//totalAnimals = animalRecords.length;
			//DisplayAnimal(0);
			return JSON.parse(req.response);

		} else {
			alert(req.statusText);
		}
	};
	// Network errors.
	req.onerror = () => {
		alert('Network error.');
	};
	// Make the request.
	req.send(data);
}

function Dirtify() {
	dirtyFlag = true;
	document.getElementById("addbutton").disabled = true;
	document.getElementById("previousbutton").disabled = true;
	document.getElementById("nextbutton").disabled = true;
	document.getElementById("searchbutton").disabled = true;
	document.getElementById("savebutton").disabled = false;
	document.getElementById("cancelbutton").disabled = false;
}

function LoadImage() {
	var output = document.getElementById('editAnimalImage');
	var input = document.getElementById('fileinput');
	var reader = new FileReader();

	reader.onload = function () {

		tempImage = reader.result;
		output.src = tempImage;
		Dirtify();

	};

	reader.readAsDataURL(input.files[0]);
	output.width = "250";
	output.height = "250";
}

window.onload = () => {
	document.getElementById("previousbutton").disabled = true;
	document.getElementById("nextbutton").disabled = true;
	document.getElementById("savebutton").disabled = true;
	for (var i = 0; i < searchFieldIds.length; i++) {
		var searchField = document.getElementById(searchFieldIds[i]);

		searchField.addEventListener('keyup', function (event) {
			if (event.keyCode === 13) {
				event.preventDefault();
				document.getElementById("searchbutton").click();
			}
		});
	}
	for (var i = 0; i < resultFieldIds.length; i++) {
		var resultField = document.getElementById(resultFieldIds[i]);

		resultField.addEventListener('keypress', function (event) {
			Dirtify();
		});
	}
}
