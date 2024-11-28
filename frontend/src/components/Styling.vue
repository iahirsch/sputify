<template>
    <div>
        <h1>Spütify</h1> 
        <div class="my-element">This text uses 'Familjen Grotesk'</div> 
        <h2>this is a text which is totally cool</h2> 
        <h3>jashdjhsahdklasdjasl</h3>
    
        <img src="../assets/image1.png">
    </div>
</template>

<style>
:root {
/* fonts */ 
  --font-heading: 'Franie', sans-serif;
  --font-body: 'Familjen Grotesk', sans-serif;

/* heading sizes DESKTOP*/ 
  --heading-year-d: 200px;
  --heading-section-d: 40px;

/* heading sizes MOBILE*/ 
  --heading-year-m: 60px;
  --heading-section-m: 20px;

/* text sizes DESKTOP*/ 
  --body-text-d: 20px;

/* text sizes MOBILE*/ 
  --body-text-m: 12px;

/* desktop images*/ 
  --grayScale: 100%;
  --opacity: 90%;

/* additional for mobile images*/
  --borderRadius: 50%;
}

/* FONT IMPORT - Familjen Grotesk */
@import url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&display=swap');


h1, h2, h3 {
  font-family: var(--font-heading);
  font-size: var(--heading-year-d);
}

body, p, li {
  font-family: var(--font-body);
  font-size: var(--body-text-d);
}

img {
  filter: var(--grayScale);
  opacity: var(--opacity);
  border-radius: var(--borderRadius);
}

.my-element {
  font-family: var(--font-body);
}


</style>