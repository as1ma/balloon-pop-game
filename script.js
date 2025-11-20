const balloons = [
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-1')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-2')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-3')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-4')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-5')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-6')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-7')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-8')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-9')

    },
    {
        status: "normal",
        next: Date.now() + 1000,
        node: document.querySelector('.balloon-image-10')

    }
]


let runAgainAt = Date.now() + 100
function nextFrame(){
    const now = Date.now()

    if (runAgainAt <= now){
        for (let i = 0; i < balloons.length; i++){
            if (balloons[i].next <= now){
                getNextStatus(balloons[i])
            }
        }
        runAgainAt = now + 100
    }

    // requestAnimationFrame(nextFrame)
}


function getNextStatus(balloon){
    const now = Date.now()
    switch (balloon.status){
        case 'normal':
            // console.log(balloon.node)
            balloon.status = 'impatient'
            balloon.next = now + 1000
            balloon.node.classList.remove('balloon','bonus-balloon','popped-balloon')
            balloon.node.classList.add('impatient-balloon')
            break
        case 'impatient':
            balloon.status = 'gone'
            // hide and schedule reappearance sooner (0.5s - 3s)
            balloon.next = now + Math.floor(Math.random() * 2500) + 500
            balloon.node.classList.remove('impatient-balloon','balloon','bonus-balloon','popped-balloon')
            balloon.node.classList.add('gone')
            break
        case 'gone':
            // gone -> appear as normal or sometimes bonus
            const bonusChance = 0.08 // 8% chance
            if (Math.random() < bonusChance){
                console.log(balloon.node)
                balloon.status = 'bonus'
                // bonus visible for 2.5 - 4s
                balloon.next = now + Math.floor(Math.random() * 1500) + 2500
                balloon.node.classList.remove('gone','balloon','impatient-balloon','popped-balloon')
                balloon.node.classList.add('bonus-balloon')
            } else {
                balloon.status = 'normal'
                // normal visible for 1.2 - 3s
                balloon.next = now + Math.floor(Math.random() * 1800) + 1200
                balloon.node.classList.remove('gone','bonus-balloon','impatient-balloon','popped-balloon')
                balloon.node.classList.add('balloon')
            }
            break
        case 'bonus':
            balloon.status = 'gone'
            balloon.next = now + 1000
            balloon.node.classList.remove('bonus-balloon','popped-balloon','impatient-balloon')
            balloon.node.classList.add('gone')
            break
    }
}

const popSound = new Audio('sounds/pop.mp3')
popSound.preload = 'auto'
popSound.volume = 0.5
popSound.addEventListener('error', () => console.warn('Pop sound failed to load: sounds/pop.mp3'))

document.querySelector(".holes-container").addEventListener("click", updateBalloon)

function updateBalloon(event){
    if (event.target.classList.contains("balloon") || event.target.classList.contains("bonus-balloon")){
        event.target.classList.add("popped-balloon")
        // popSound.currentTime = 0
        // popSound.play()
            try {
                if (popSound && typeof popSound.play === 'function'){
                    popSound.currentTime = 0
                    popSound.play().catch((err) => console.debug('popSound play blocked:', err))
                }
            } catch (e) {
                console.debug('pop sound play error', e)
            }
            updateScore(event)
    }else if(event.target.classList.contains("bonus-balloon")){
        event.target.classList.add("popped-balloon")
        updateScore(event)
    }

    if (event.target.classList.contains("impatient-balloon")){
        updateScore(event)
    } 
}


let score = 0
let highScore = localStorage.getItem("highScore") || 0
document.querySelector(".high-score").textContent = "High Score: " + highScore

function updateScore(balloon){
    if (balloon.target.classList.contains("bonus-balloon")){
        score += 10
        document.querySelector(".score").innerHTML = (`Score: ${score}`)
    } else if (balloon.target.classList.contains("impatient-balloon")){
        // apply penalty but don't allow score to go below 0
        score = Math.max(0, score - 5)
        document.querySelector(".score").innerHTML = (`Score: ${score}`)
    }else{
        score ++
        document.querySelector(".score").innerHTML = (`Score: ${score}`)
    }

    //high score
    if(localStorage){
        if(score > highScore){
            localStorage.setItem("highScore", score)
            document.querySelector(".high-score").textContent = "High Score: " + score
        }
        console.log(highScore)
    }
    return score 
}



function countdownFunc(){
    let countdown = 30
    // const timerElement = document.querySelector(".countdown")

    const timerFunc = setInterval(function(){
        countdown--
        requestAnimationFrame(nextFrame)
        // timerElement.textContent = countdown + ' seconds remaining'

        const timerBarFill = document.querySelector(".stats-timer-fill")
        const percentFill = (countdown / 30) * 100
        timerBarFill.style.width = percentFill + '%'
        
        if (countdown <= 0){
            clearInterval(timerFunc)
            endScreen()
        }
    }, 1000)
}


function endScreen(){
    const end = document.querySelector(".end-screen")
    end.classList.remove("end-screen-hide")
    // score = 70 //testing
        const endGamePanel = document.querySelector('.end-game')
        const highScoreDisplay = document.querySelector(".congratulations")
        const gameLostDisplay = document.querySelector(".game-lost")

        if (score > highScore) { 
            document.querySelector(".high-score").textContent = "High Score: " + score
            highScoreDisplay.classList.remove("congratulations-hide")
            gameLostDisplay.classList.add("game-lost-hide")
            endGamePanel.classList.add('congrats')
            console.log("beat high score")
        } else {
            gameLostDisplay.classList.remove("game-lost-hide")
            highScoreDisplay.classList.add("congratulations-hide")
            endGamePanel.classList.remove('congrats')
            console.log("did not beat high score")
    }

    const endScoreDisplay = document.querySelector(".end-score")
    endScoreDisplay.textContent = "Your Score: " + score

    window.cancelAnimationFrame(nextFrame)

    const playAgain = document.querySelector(".play-again")
    playAgain.addEventListener("click", function(){
        end.classList.add("end-screen-hide")
        score = 0
        document.querySelector(".score").innerHTML = (`Score: ${score}`)
        nextFrame()
        countdownFunc()
    })
}


function game(){
    //start screen
    const startGame = document.querySelector(".start-btn")
    const startScreen = document.querySelector(".start-game")
    startGame.addEventListener("click", function(){
        startScreen.classList.add("start-game-hide")
        nextFrame()
        countdownFunc()
    })

    //initialise balloons
    //start timer

    //play again to beat high score
}

game()

//To Do:
//Change display from flex to grid 
//Refactor statuses as methods in class?
//css animations
//ignore clicks on already clicked balloons