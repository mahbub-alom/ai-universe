// load data function
const loadData = async (callback) => {
    try {
      const apiUrl = `https://openapi.programming-hero.com/api/ai/tools`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      callback(data);
    } catch (err) {
      console.log(err);
    }
  };
  
  //all data show common function
  const appendData = (tools, cards) => {
    tools.forEach((element) => {
      const { features, name, id, image, published_in } = element;
  
      const card = document.createElement("div");
  
      card.innerHTML = `
      <div class="bg-base-100 shadow-xl card h-full">
            <figure class="px-12 pt-12">
              <img src="${image}" alt="..." class="rounded-xl" />
            </figure>
            <div class="text-left card-body">
              <div class="mb-4">
                <h2 class="card-title text-[20px] font-bold mb-4">Features</h2>
                <ol class="list-inside list-decimal">
                  ${createItem(features)}
                </ol>
              </div>
              <hr>
              <div class="card-actions flex items-center justify-between mt-3">
                <div>
                  <h1 class="text-[20px] font-bold mb-4">${name}</h1>
                  <p><i class="fa-solid fa-calendar-days"></i> ${published_in}</p>
                </div>
                <label for="popUp" onclick="dataById('${id}')" class="text-red-500 bg-[#FEF7F7] px-4 py-3 rounded-full">
                  <i  class="fa-solid fa-arrow-right"></i>
                </label>
              </div>
            </div>
          </div>
      `;
      cards.appendChild(card);
    });
  };
  
  // displayData function start
  
  const displayData = (data) => {
    let {
      data: { tools },
    } = data;
  
    const cards = document.getElementById("cards");
  
    const moreItemBtn = document.getElementById("moreItemBtn");
  
    if (tools.length > 6) {
      moreItemBtn.classList.remove("hidden");
    } 
    else {
      moreItemBtn.classList.add("hidden");
    }
    tools = tools.slice(0, 6);
    appendData(tools, cards);
  };
  
  // showAllData function start
  
  const showAllData = (data) => {
    let {
      data: { tools },
    } = data;
  
    const cards = document.getElementById("cards");
    cards.innerHTML = "";
  
    const moreItemBtn = document.getElementById("moreItemBtn");
  
    if (tools.length > 6) {
      moreItemBtn.classList.add("hidden");
    } else {
      moreItemBtn.classList.remove("hidden");
    }
    appendData(tools, cards);
    loading(false);
  };
  
  // showAllData event listener start

  document.getElementById("moreItemBtn").addEventListener("click", () => {
    loadData(showAllData);
    loading(true);
  });
  
  // loading function start
  
  const loading = (isLoading) => {
    const loading = document.getElementById("loading");
    if (isLoading) {
      loading.classList.remove("hidden");
    } else {
      loading.classList.add("hidden");
    }
  };
  

    // showingUpDetails function start here 
  const showingUpDetails = ({ data }) => {
    const {
      description,
      pricing,
      image_link,
      accuracy,
      features,
      integrations,
      input_output_examples,
    } = data;
  
    const accuracyPercent = accuracy.score * 100 + "% accuracy";
  
    const containerOfModal = document.getElementById("modal-container");
    containerOfModal.innerHTML = "";
    const bodyOfModal = document.createElement("div");
    bodyOfModal.className = `md:m-10 grid grid-cols-1 sm:grid-cols-2 gap-5`;
    bodyOfModal.innerHTML = `
    
    <div class="rounded-2xl bg-[rgba(235,87,87,0.05)] shadow-md p-7">
    <h1 class="text-xl font-bold text-[#111111]">${description}</h1>
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-between my-5">
    ${month(pricing)}
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h1 class="font-bold text-[#111111] text-xl">Features</h1>
        <ul class="list-inside list-disc">
        ${createItem(features)}
        </ul>
      </div>
      <div cl>
        <h1 class="font-bold text-[#111111] text-xl">Integrations</h1>
        <ul class="list-inside list-disc">
           ${createItem(integrations)}
        </ul>
      </div>
    </div>
  </div>
  
    <div class="bg-[#E7E7E7] shadow-md p-7 rounded-2xl">
        <figure class=" rounded-xl relative ">
        <img src="${image_link[0]}" class="rounded-xl" />
        <div id="accuracyBadge" class="badge flex items-center justify-center px-2 py-2 font-semibold text-xs sm:text-base bg-[#EB5757] rounded-md absolute right-1 top-1 sm:right-4 sm:top-4 border-none">${
        accuracyPercent ? accuracyPercent : ""
      }
    </div>
    </figure>
    <div class="text-center mt-5">
      <h1 class="font-bold text-[#111111] text-xl mb-2">${
        input_output_examples !== null
          ? input_output_examples[0].input
          : "Can you give any example?"
      }</h1>
      <p>${
        input_output_examples !== null
          ? input_output_examples[1].output
          : "No! Not Yet! Take a break!!!"
      }</p>
    </div>
  </div>
      `;
  
    containerOfModal.appendChild(bodyOfModal);
  
    const badge = document.getElementById("accuracyBadge");
  
    if (accuracy.score === null) {
      badge.classList.add("hidden");
    }
  };
  
  // !dynamic li create function
  const createItem = (prop) => {
    let li = "";
    if (Array.isArray(prop)) {
      prop.forEach((element) => {
        li += `<li>${element}</li>`;
      });
      return li;
    } else if (prop === null) {
      li += `<li>No Data Found</li>`;
      return li;
    } else {
      for (const key in prop) {
        li += `<li>${prop[key].feature_name}</li>`;
      }
      return li;
    }
  };

  // month plan function
  
  const month = (arr) => {
    let element = "";
    if (Array.isArray(arr)) {
      for (const key in arr) {
        element += `
        <div
          class="rounded-md bg-white w-[120px] h-[100px] text-[#03A30A] flex flex-col gap-1 items-center justify-center text-center font-semibold"
        >
        <p>${arr[key].price !== "0" ? arr[key].price : "Free Of Cost"}</p>
        <p>${arr[key].plan !== "Free" ? arr[key].plan : "Basic"}</p>
        </div>`;
      }
    }
    else{
      element+= `
      <div class="rounded-md bg-white w-full h-[100px] text-[#03A30A] flex items-center justify-center text-center font-semibold">      
      <p>No Data Found</p>
      </div>`;
    }
    return element;
  };
  
  // dynamic data id
  const dataById = async (id) => {
    try {
      const apiUrl = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      showingUpDetails(data, id);
    } 
    catch (err) {
      console.log(err);
    }
  };
  
  // sort by date code is here
  const serialByDate = ({data:{tools}}) => {
    const data = tools.sort(function(a,b){    
      return (new Date(b.published_in) - new Date(a.published_in));
    })
    sortData(data);
  };
  
  const sortData = (tools) => {
  
    const cards = document.getElementById("cards");
    cards.innerHTML = "";
  
    const moreItemBtn = document.getElementById("moreItemBtn");
  
    if (tools.length > 6) {
      moreItemBtn.classList.add("hidden");
    } else {
      moreItemBtn.classList.remove("hidden");
    }
    appendData(tools, cards);
    };

  // sort by date event listener
  document.getElementById("sortById").addEventListener("click",()=>{
    loadData(serialByDate)
  })
  
  
  loadData(displayData);
  