function onJSON_workout(json){
    console.log(json);

    const library = document.querySelector('#album-view');
    library.innerHTML = '';

    let num_results = Object.keys(json).length;
    if(num_results>20)
      num_results=20;

    for(let i=0; i<num_results; i++){
        let num_steps = Object.keys(json[i].steps).length;

        // mostro solo gli esercizi che hanno una descrizione 
        if(num_steps !== 0){
            const box = document.createElement('div');
            box.classList.add('box');

            const exercise_name = document.createElement('h1');
            exercise_name.textContent = json[i].exercise_name;
            box.appendChild(exercise_name);

            const category = document.createElement('h2');
            category.textContent = json[i].Category;
            box.appendChild(category);
        
            for(let j=0; j<num_steps; j++){
                const step = document.createElement('p');
                step.textContent = json[i].steps[j];
                box.appendChild(step);
            }

            const video = document.createElement('video');
            video.src = json[i].videoURL[0];
            box.appendChild(video);

            library.appendChild(box);
        }
    }
}

function onJSON_bmi(json){
    console.log(json);

    const library = document.querySelector('#album-view');
    library.innerHTML = '';

    library.classList.add('reduced-width');

    const result = json.data;

    const content_container = document.createElement('div');
    content_container.classList.add('new-box'); 

    const title = document.createElement('h1');
    title.textContent = 'Body Mass Index';
    content_container.appendChild(title);

    const p = document.createElement('p');
    p.textContent = 'Il tuo BMI è ' + result.bmi;
    content_container.appendChild(p);

    const health = document.createElement('p');
    health.textContent = result.health;
    
    if(result.health === 'Normal')
      health.classList.add('green');
    else
      health.classList.add('red');

    content_container.appendChild(health);

    library.appendChild(content_container);
}

function onJSON_nutrition(json){
    console.log(json);

    const library = document.querySelector('#album-view');
    library.innerHTML = '';

    library.classList.add('reduced-width');

    let num_results = Object.keys(json).length;

    for(let i=0; i<num_results; i++){
        const result = json[i]; 

        const content_container = document.createElement('div');
        content_container.classList.add('new-box'); 

        const food = document.createElement('h1');
        food.textContent = result.name;
        content_container.appendChild(food);

        const grams = document.createElement('p');
        grams.textContent = '(' + result.serving_size_g + 'g)';
        grams.classList.add('secondary-info');
        content_container.appendChild(grams);

        const calories = document.createElement('p');
        calories.textContent = 'Calories: ' + result.calories;
        content_container.appendChild(calories);

        const protein = document.createElement('p');
        protein.textContent = 'Protein: ' + result.protein_g;
        content_container.appendChild(protein);

        const fat = document.createElement('p');
        fat.textContent = 'Fat: ' + result.fat_total_g;
        content_container.appendChild(fat);

        library.appendChild(content_container);
    }
}

function onResponse(response){
    return response.json();
}

function search(event)
{
	event.preventDefault(); 

    const content = document.querySelector('#content').value;

    const eta_value = document.getElementById("eta").value;
    const peso_value = document.getElementById("peso").value;
    const altezza_value = document.getElementById("altezza").value;

    // Verifico che l'utente abbia inserito i valori
	if(content || (eta_value && peso_value && altezza_value)){
  
		const tipo_value = document.querySelector('#tipo').value;

        if(tipo_value === "muscle"){
            const text = encodeURIComponent(content);

            // fetch a muscleWiki
            const musclewiki_request = muscleWiki_endpoint + '?muscle=' + text;
            fetch(musclewiki_request, 
                {
                    headers: {
                        'X-RapidAPI-Key': key,
                        'X-RapidAPI-Host': musclewiki_host
                    }
                }).then(onResponse).then(onJSON_workout);
        
        } else if(tipo_value === "bmi"){
            const text_eta = encodeURIComponent(eta_value);
            const text_peso = encodeURIComponent(peso_value);
            const text_altezza = encodeURIComponent(altezza_value);

            // fetch a Fitness calculator
            const bmi_request = fitnessCalculator_endpoint + '?age=' + 
                  text_eta + '&weight=' + text_peso + '&height=' + text_altezza;
                  fetch(bmi_request,
                  {
                      headers: {
                          'X-RapidAPI-Key': key,
                          'X-RapidAPI-Host': fitnessCalculator_host
                      }
                  }).then(onResponse).then(onJSON_bmi);

        } else if(tipo_value === "nutrition"){
            const text = encodeURIComponent(content);

            // fetch a Nutrition by API-Ninjas
            nutrition_request = nutrition_endpoint + '?query=' + text;
            fetch(nutrition_request,
            {
                headers: {
                    'content-type': 'application/octet-stream',
                    'X-RapidAPI-Key': key,
                    'X-RapidAPI-Host': nutrition_host
                }
            }).then(onResponse).then(onJSON_nutrition);
        }
    }
}

function changeLabel(event){
    const tipo_cliccato = (event.target).value;

    if(tipo_cliccato === 'bmi'){
        /* nascondo il label con id="cerca" e mostro i label per il bmi 
           all'interno del div con id="search_bmi" */
        const cerca = document.querySelector('#cerca');
        cerca.classList.add('hidden');

        const label_bmi = document.querySelector('#search_bmi');
        label_bmi.classList.remove('hidden');

        const label_eta = document.querySelector('#eta');
        const label_peso = document.querySelector('#peso');
        const label_altezza = document.querySelector('#altezza');

        label_eta.classList.add('label_bmi');
        label_peso.classList.add('label_bmi');
        label_altezza.classList.add('label_bmi');

    } else if(tipo_cliccato === 'muscle' || tipo_cliccato === 'nutrition'){
        // nascondo i label per il bmi e mostro quello con id="cerca
        const cerca = document.querySelector('#cerca');
        cerca.classList.remove('hidden');

        const label_bmi = document.querySelector('#search_bmi');
        label_bmi.classList.add('hidden');
    }

    const library = document.querySelector('#album-view');
    library.innerHTML = '';
}

const key = 'db7fdf2515msh0fb7510c1f5d0b8p194d8djsnb9a133ac8e30'; // chiave fornita da RapidAPI

// endpoints
const fitnessCalculator_endpoint = 'https://fitness-calculator.p.rapidapi.com/bmi';
const muscleWiki_endpoint = 'https://musclewiki.p.rapidapi.com/exercises';
const nutrition_endpoint = 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition';

// altri links
const fitnessCalculator_host = 'fitness-calculator.p.rapidapi.com';
const musclewiki_host = 'musclewiki.p.rapidapi.com';
const nutrition_host = 'nutrition-by-api-ninjas.p.rapidapi.com';

const form = document.querySelector('#search_content');
form.addEventListener('submit', search);

const tipo = document.querySelector("#tipo");
tipo.addEventListener('click', changeLabel);
