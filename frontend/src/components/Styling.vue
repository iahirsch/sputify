<template>
 <h1>Spütify</h1>  
 <h2>this is a text which is totally cool</h2> 
 <h3>jashdjhsahdklasdjasl</h3>

 <img src="../assets/image1.png">
</template>

<style>
:root{
    --heading-year: 4rem;
    --heading-section: 2rem;
    --body-text: 1.6rem;
    --font-family: 'Franie', sans-serif;
    --font-body: 'Geostar', sans-serif;
    --grayScale: 100%;
    --borderRadius: 50%;
    --color: blue;
}

h1{
    font-size: var(--heading-year);
    font-family: var(--font-family);
    color: var(--color);
}

h2{
    font-size: var(--heading-section);
    font-family: var(--font-family);
    color: var(--color);
}

img{
    border-radius: var(--borderRadius);
    opacity: 50%;
}

body{
    font-size: var(--body-text);
    font-family: var(--font-body);
    color: var(--color);
    background-color: var(--grayScale);
}
</style>