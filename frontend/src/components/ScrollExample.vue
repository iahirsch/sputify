
   <template>
  <div class="three-column-layout">
    <rightSide>
      <div class="sides">
        <div class="title">2020</div>
        <div class="testdiv">Top Song</div>
      </div>
      <div class="sides">
        <div class="title">2021</div>
        <div class="testdiv">Top Song</div>
      </div>
      <div class="sides">
        <div class="title">2022</div>
        <div class="testdiv">Top Song</div>
      </div>
      <div class="sides">
        <div class="title">2023</div>
        <div class="testdiv">Top Song</div>
      </div>
      <div class="lsides">
        <div class="title">2024</div>
        <div class="testdiv">Top Song</div>
      </div>
    </rightSide>

    <main>
        <div class="main">
        <div class="main__graphic">Bubble</div>
      </div>
    </main>

    <leftSide>
      <div class="sides">
        <div class="title">Badge</div>
        <div class="testdiv">other Stuff</div>
      </div>
      <div class="sides">
        <div class="title">Badge</div>
        <div class="testdiv">other Stuff</div>
      </div>
      <div class="sides">
        <div class="title">Badge</div>
        <div class="testdiv">other Stuff</div>
      </div>
      <div class="sides">
        <div class="title">Badge</div>
        <div class="testdiv">other Stuff</div>
      </div>
      <div class="sides">
        <div class="title">Badge</div>
        <div class="testdiv">other Stuff</div>
      </div>
    </leftSide>
  </div>

  </template>
  <style scoped>
  .three-column-layout {
    display: grid;
    grid-template-areas:
      "rightSide"
      "main"
      "leftSide";
  
      rightSide {
      grid-area: rightSide;
      margin-top: 5vh;
    }
    main {
        grid-area: main;
        align-self: start;  /* Make sure to set this for sticky behavior..so eine scheisse */
        position: sticky;
        top: 0;
        min-height: 100vh; 
        margin-top: 5vh;
        }

    leftSide {
      grid-area: leftSide;
      margin-top: 5vh;
    }
  
    @media (min-width: 80vw) {
       
      grid-template-columns: 1fr 2fr 1fr;
      grid-template-areas: "rightSide main leftSide";
    }

    .sides{
    width: auto;
    border: 0.5px solid #ccc;
  }

  .title {
    font-size: 6rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .testdiv {
    width: 20vw;
    height: 60vh;
    opacity: 0.2;
  }

  .main__graphic {
  position: sticky;
  top: 0; /* This ensures it stays at the top */
  margin-top: 25%;
  width: 50vw;
  height: 50vh;
  border: 1px solid #ccc;
  opacity: 0.2;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

  
  }
  </style>
