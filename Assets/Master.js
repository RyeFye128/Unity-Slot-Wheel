#pragma strict
/*This script runs everything in the slot machine game.*/

//TODO: visually make coins come out when winning

private var slotBox : GameObject;
private var slot1 : GameObject;
private var slot2 : GameObject;
private var slot3 :GameObject;
private var startWall: GameObject;


var slotBoxTexture : Texture2D;
var slot1Texture : Texture2D;
var slot2Texture : Texture2D;
var slot3Texture : Texture2D;
var startMenuTexture: Texture2D;

var slot1Fab : GameObject;
var slot2Fab : GameObject;
var slot3Fab : GameObject;

private var guiStyle : GUIStyle = new GUIStyle();

var timer : Time;
var timeSinceSpin : Time;
private var spinWheel : boolean = false;
private var temp : float;
private var notJustStarted: boolean = true;
private var seeifIwon : boolean = false;
private var toggle1 : boolean = true;//used to spin wheel 1
private var toggle2: boolean = true;//used to spin wheel 2
private var toggle3 : boolean = true;//used to spin wheel 3
private var state1 : boolean = false;//Spin has been clicked
private var state2 : boolean = false;//Stop spin has been clicked
private var betline1 : boolean = true;// betline is enabled or not, middle
private var betline2 : boolean = true; //betline is enabled or not, lower
private var betline3 :boolean = true;//betline is enabled or not, upper
private var betline4 : boolean = true;//betline is enabled or not, diag1
private var betline5 : boolean = true;//betline is enabled or not, diag2
private var showLoss : boolean = false;
private var textHolder : int = 5;
private var startMenu : boolean = true;

private var wheel1Faces : String[] = new String[361];
private var wheel2Faces : String[] = new String[361];
private var wheel3Faces : String[] = new String[361];

//Create the lines that will highlight the winning lines/loosing ones
private var line1Bar: GameObject;
private var line2Bar: GameObject;
private var line3Bar: GameObject;
private var line4Bar: GameObject;
private var line5Bar: GameObject;

//Used to calcuate payoff at the end.
private var numCherryLines : int = 0;
private var numLemonLines : int = 0;
private var numBarLines : int = 0;
private var num7Lines : int = 0;
private var numDiamondLines : int = 0;
private var num1Cherry : float = 0.0;
private var num2Cherry : float = 0;

private var betLines : int = 1;
private var gameStatus : String = "Playing";


var rand : Random;

function Start () {

    timer = new Time();
    setupArray();
 
    
    slotBox = GameObject.CreatePrimitive(PrimitiveType.Cube);
    slotBox.name = "SlotBox";
    slotBox.transform.position = Vector3 (-0.1655, 0, -0.006);
    slotBox.transform.localScale = Vector3 (3, 3, 5);
    slotBox.GetComponent.<Renderer>().material.color = Color.black;

    slot1 = GameObject.Instantiate(slot1Fab, Vector3 (-5, 1, 0), Quaternion.identity);
    slot1.GetComponent.<Renderer>().material.mainTexture = slot1Texture;
    slot1.transform.position = Vector3 (0,0,-0.6);
    slot1.transform.localScale = Vector3(50,50,50);
    slot1.name = "Slot1";

    slot2 = GameObject.Instantiate(slot2Fab, Vector3 (-5, 1, 0), Quaternion.identity);
    slot2.GetComponent.<Renderer>().material.mainTexture = slot2Texture;
    slot2.transform.position = Vector3(0, 0, -0.3);
    slot2.transform.localScale = Vector3 (50,50,50);
    slot2.name = "Slot2";

    slot3 = GameObject.Instantiate(slot3Fab, Vector3 (-5, 1, 0), Quaternion.identity);
    slot3.GetComponent.<Renderer>().material.mainTexture = slot3Texture;
    slot3.transform.position = Vector3 (0,0,0);
    slot3.transform.localScale = Vector3(50,50,50);
    slot3.name = "Slot3";

    line1Bar = GameObject.CreatePrimitive(PrimitiveType.Cube);
    line1Bar.transform.position = Vector3(1.478, 0, -0.31);
    line1Bar.transform.localScale = Vector3 (0.06, 0.02, 0.9);
    line1Bar.GetComponent.<Renderer>().material.color = Color.green;
    line1Bar.GetComponent.<Renderer>().enabled = false;
    

    line2Bar = GameObject.CreatePrimitive(PrimitiveType.Cube);
    line2Bar.transform.position = Vector3 ( 1.411, -0.442, -0.31);
    line2Bar.transform.localScale = Vector3 (0.06, 0.02, 0.9);
    line2Bar.GetComponent.<Renderer>().material.color = Color.green;
    line2Bar.GetComponent.<Renderer>().enabled = false;

    line3Bar = GameObject.CreatePrimitive(PrimitiveType.Cube);
    line3Bar.transform.position = Vector3 ( 1.411, 0.456, -0.31);
    line3Bar.transform.localScale = Vector3 (0.06, 0.02, 0.9);
    line3Bar.GetComponent.<Renderer>().material.color = Color.green;
    line3Bar.GetComponent.<Renderer>().enabled = false;

    line4Bar = GameObject.CreatePrimitive(PrimitiveType.Cube);
    line4Bar.transform.position = Vector3 (1.9, .039, -0.303);
    line4Bar.transform.localScale = Vector3 (0.02, 0.02, 1.05);
    line4Bar.transform.rotation  = Quaternion.AngleAxis(-303, Vector3.right);
    line4Bar.GetComponent.<Renderer>().material.color = Color.green;
    line4Bar.GetComponent.<Renderer>().enabled = false;

    line5Bar = GameObject.CreatePrimitive(PrimitiveType.Cube);
    line5Bar.transform.position = Vector3 (1.9,0.036, -0.295);
    line5Bar.transform.localScale = Vector3 (0.02, 0.02, 1.05);
    line5Bar.transform.rotation  = Quaternion.AngleAxis(-56, Vector3.right);
    line5Bar.GetComponent.<Renderer>().material.color = Color.green;
    line5Bar.GetComponent.<Renderer>().enabled = false;

    startWall = GameObject.CreatePrimitive(PrimitiveType.Cube);
    startWall.transform.position = Vector3 (1.822,0,0);
    startWall.transform.localScale = Vector3 (0.07, 2.98, 4.7);
    var tex : Texture2D;
    tex = Resources.Load("startMenuBackground.jpg") as Texture2D;
    startWall.GetComponent.<Renderer>().material.mainTexture = tex;

    
    startWall.GetComponent.<Renderer>().enabled = true;
    startWall.name = "StartWall";

   


}
function OnGUI()
{
    guiStyle.fontSize = 80;
        
    guiStyle.alignment = TextAnchor.MiddleCenter;
    if(!startMenu)
    {
        if(textHolder < 1 && showLoss)
        {
            GUI.enabled = false;
        }
        else GUI.enabled = true;
        GUI.TextField(Rect(100,10,130,30), "Credits");
        GUI.TextField(Rect(100,40,130,30), "" + textHolder);
    
    
        if(GUI.Button(Rect(100,100,130,30),"Click to spin"))
        {
            if(betLines > textHolder)
            {
                //not enough to bet, show error.
                gameStatus = "Not Enough Money";
                return;  
            }
            else gameStatus = "Playing";
            if(state1) return;//if its spinning, dont spin again while its still spinning
            //Destroy the winning lines when spin is about to start
            line1Bar.GetComponent.<Renderer>().enabled = false;
            line2Bar.GetComponent.<Renderer>().enabled = false;
            line3Bar.GetComponent.<Renderer>().enabled = false;
            line4Bar.GetComponent.<Renderer>().enabled = false;
            line5Bar.GetComponent.<Renderer>().enabled = false;
            spinWheel = true;
            state1 = true;
            state2 = false;
            temp = timer.realtimeSinceStartup;//captures time for comparions on interval between wheel starts
            notJustStarted = false;
            toggle1 = toggle2 = toggle3 = true;  

        
            num1Cherry = 0.0;
            num2Cherry = 0.0;
            numCherryLines = 0.0;
            numLemonLines = 0.0;
            numBarLines  = 0.0;
            num7Lines = 0.0;
            numDiamondLines = 0.0;
            textHolder-= betLines;

            configureBetlines();
        
        

        }
    
        if(GUI.Button(Rect(100,130,130,30),"Click to stop"))
        {
            if(state2)return;//if stopped, dont stop again.
            state1 = false;
            state2 = true;
            spinWheel = false;
            temp = temp = timer.realtimeSinceStartup;//captures time for comparions on interval between wheel stops
            seeifIwon = true;
        
        
            //need to stop the faces on multiples of 18
            //maybe rotation - mod18? 355 - (mod18 = 13) = 342, a multiple of 18.
        }
        GUI.skin.label.alignment = TextAnchor.MiddleLeft;
    
        GUI.Label(Rect(Screen.width - 250,20,180,30),"Diamonds win 1150 coins");
        GUI.Label(Rect(Screen.width - 250,50,180,30),"7s win 140 coins");
        GUI.Label(Rect(Screen.width - 250,80,180,30),"Bars win 40 coins");
        GUI.Label(Rect(Screen.width - 250,110,180,30),"Lemons win 16 coins");
        GUI.Label(Rect(Screen.width - 250,140,180,30),"Cherries win 8 coins");
        GUI.Label(Rect(Screen.width - 250,170,180,30),"2 Cherries win 3 coins");
        GUI.Label(Rect(Screen.width - 250,200,180,30),"1 Cherry wins 1 coin");
        GUI.skin.label.alignment = TextAnchor.MiddleCenter;
        GUI.Label(Rect(100,160,130,30), gameStatus);
        GUI.Label(Rect((Screen.width/2)-80,Screen.height - 41,150,50),"Betlines " + betLines);
    
        //Debug output, as requested by Dr. Kishore.
        GUI.Label(Rect(10,Screen.height-35,270,50),"Debug: " + num1Cherry + " + " + 3*num2Cherry + " + " + 8*numCherryLines + " + " + 16*numLemonLines + " + " + 40*numBarLines + " + " + 140*num7Lines + " + " + 1150*numDiamondLines + " = " + calculatePayout());
    
        if(GUI.Button(Rect((Screen.width/2) + 30,Screen.height-30,30,30),"+") && betLines < 5)
        {
            betLines++;
        }

        if(GUI.Button(Rect((Screen.width/2) -75,Screen.height-30,30,30),"-") && betLines > 1)
        {
            betLines--;
        }

        if(showLoss)
        {
            //the game has ended
            GUI.enabled = true;
            
            GUI.Label(Rect((Screen.width/2)-(Screen.width/3),Screen.height/25,(Screen.width/1.5),100),"Game Over", guiStyle);
            if(GUI.Button(Rect((Screen.width/2)-(Screen.width/3),130,(Screen.width/1.5),100),"Restart Game"))
            {
                //textHolder = 25;
                startMenu = true;
                showLoss = false;
                startWall.GetComponent.<Renderer>().enabled = true;
                betLines = 1;
            }
            /*  if(GUI.Button(Rect((Screen.width/2)-(Screen.width/3),230,(Screen.width/1.5),100),"Exit Game"))
              {
                  //close out of the game
                  Application.Quit();
              }*/
        }
    }
    else
    {
        //do the startup option code
    
        GUI.Label(Rect((Screen.width/2)-(Screen.width/3),Screen.height/25,(Screen.width/1.5),100),"Start Menu", guiStyle);
        guiStyle.fontSize = 40;
        GUI.Label(Rect((Screen.width/2)-(Screen.width/3),Screen.height/8,(Screen.width/1.5),100),"Select Start Credits", guiStyle);
        guiStyle.fontSize = 80;

        if(GUI.Button(Rect((Screen.width/2)-(Screen.width/3),Screen.height/4,(Screen.width/1.5),100),"25 Credits"))
        {
            textHolder = 25;
            startMenu = false;
            startWall.GetComponent.<Renderer>().enabled = false;
        }

        if(GUI.Button(Rect((Screen.width/2)-(Screen.width/3),Screen.height/2.7,(Screen.width/1.5),100),"50 Credits"))
        {
            textHolder = 50;
            startMenu = false;
            startWall.GetComponent.<Renderer>().enabled = false;
        }
    }

}



function Update () {
    

   
    var t : int = Mathf.Floor(100000*Time.time);
    var seed = t % 100;
    rand.seed = seed;
    if(spinWheel)//starts the wheels uniformily
    {
        
        slot1.transform.rotation = Quaternion.AngleAxis(timeSinceSpin.realtimeSinceStartup*15000, Vector3.forward);

        if( timer.realtimeSinceStartup > 0.5 + temp)
        {
            //starts slot 2 0.5 sec after slot 1   
            slot2.transform.rotation =  Quaternion.AngleAxis(timeSinceSpin.realtimeSinceStartup*15000, Vector3.forward);
            
        }
        if(timer.realtimeSinceStartup > 1.0 + temp)
        {
            //starts slot 3 1.0 seconds after slot 1
            slot3.transform.rotation =  Quaternion.AngleAxis(timeSinceSpin.realtimeSinceStartup*15000, Vector3.forward);
        }
  
    
    }
    if(!spinWheel && !notJustStarted)//wheels are stopped and the game has not just started, e.x: wheels stopping after play.
    {
      stopWheels();
    }

}

function stopWheels()//stops the wheels similarily to how they were started and sets the faces to a multiple of 18
{
    
    if(toggle1)
        {
            fixFaces(1);//stop wheel 1
            toggle1 = false;
        }
    if(timer.realtimeSinceStartup <= 0.5 + temp)
    {
        
        slot2.transform.rotation =  Quaternion.AngleAxis(timeSinceSpin.realtimeSinceStartup*15000, Vector3.forward);
        slot3.transform.rotation =  Quaternion.AngleAxis(timeSinceSpin.realtimeSinceStartup*15000, Vector3.forward);
    }
   

    if(timer.realtimeSinceStartup > 0.5 + temp && timer.realtimeSinceStartup <= 1.0 + temp)
    {
        if(toggle2)
        {
            fixFaces(2);//stop wheel 2
            toggle2 = false;
        }
        slot3.transform.rotation =  Quaternion.AngleAxis(timeSinceSpin.realtimeSinceStartup*15000, Vector3.forward);
    }
    if(timer.realtimeSinceStartup > 1.0 + temp)
    {
        if(toggle3)
        {
            fixFaces(3);//stop wheel 3
            toggle3 = false;
            checkWinning(Mathf.Round(slot1.transform.eulerAngles.z), Mathf.Round(slot2.transform.eulerAngles.z),Mathf.Round(slot3.transform.eulerAngles.z));
            
        }
    }
  //  textHolder = Mathf.Round(slot1.transform.eulerAngles.z) + " " + Mathf.Round(slot2.transform.eulerAngles.z) + " " + Mathf.Round(slot3.transform.eulerAngles.z);
   

    
}


//aligns the faces nicely and checks if they are a winner. checks only once, not on each frame. kinda like "states"
function fixFaces(wheel : int)
{
    
    var raw: int;
    if(wheel == 1)
    {
        raw = rand.Range(0,360);
        raw = raw - raw%18;
        slot1.transform.rotation =  Quaternion.AngleAxis(Mathf.Round(raw), Vector3.forward);
    }
    
    if(wheel == 2)
    {
        raw  = rand.Range(0,360);
        raw = raw - raw%18;
        slot2.transform.rotation =  Quaternion.AngleAxis(Mathf.Round(raw), Vector3.forward);
    }
    if(wheel == 3)
    {
        raw = rand.Range(0,360);
        raw = raw - raw%18;
        slot3.transform.rotation =  Quaternion.AngleAxis(Mathf.Round(raw), Vector3.forward);
    }

}

    //stores the faces, per degree of 18, in an array for comparison later on
    //note: will need to drop decimals on the degrees. 90.000001 appears sometimes.
function setupArray()
{
    wheel1Faces[0]  = "Bar";
    wheel1Faces[18]  = "Blank";
    wheel1Faces[36] = "Cherry";
    wheel1Faces[54] = "Lemon";
    wheel1Faces[72] = "Diamond";
    wheel1Faces[90] = "Blank";
    wheel1Faces[108] = "Cherry";
    wheel1Faces[126] = "Lemon";
    wheel1Faces[144] = "Bar";
    wheel1Faces[162] = "Blank";
    wheel1Faces[180] = "Cherry";
    wheel1Faces[198] = "7";
    wheel1Faces[216] = "Lemon";
    wheel1Faces[234] = "Blank";
    wheel1Faces[252] = "Cherry";
    wheel1Faces[270] = "Bar";
    wheel1Faces[288] = "Lemon";
    wheel1Faces[306] = "Blank";
    wheel1Faces[324] = "Cherry";
    wheel1Faces[342] = "7";
    wheel1Faces[360] = "Bar";
    //cherries and blanks should have same payout.

    wheel2Faces[0] = "Blank";
    wheel2Faces[18] = "Lemon";
    wheel2Faces[36] = "Cherry";
    wheel2Faces[54] = "7";
    wheel2Faces[72] = "Blank";
    wheel2Faces[90] = "Lemon";
    wheel2Faces[108] = "Cherry";
    wheel2Faces[126] = "Bar";
    wheel2Faces[144] = "Lemon";
    wheel2Faces[162] = "Diamond";
    wheel2Faces[180] = "Cherry";
    wheel2Faces[198] = "Blank";
    wheel2Faces[216] = "Blank";
    wheel2Faces[234] = "Bar";
    wheel2Faces[252] = "Cherry";
    wheel2Faces[270] = "Blank";
    wheel2Faces[288] = "Bar";
    wheel2Faces[306] = "7";
    wheel2Faces[324] = "Cherry";
    wheel2Faces[342] = "Lemon";
    wheel2Faces[360] = "Blank";

    wheel3Faces[0] = "Bar";
    wheel3Faces[18] = "Blank";
    wheel3Faces[36] = "Cherry";
    wheel3Faces[54] = "Lemon";
    wheel3Faces[72] = "Diamond";
    wheel3Faces[90] = "Blank";
    wheel3Faces[108] = "Cherry";
    wheel3Faces[126]=   "Lemon";
    wheel3Faces[144] = "Bar";
    wheel3Faces[162] = "Blank";
    wheel3Faces[180] = "Cherry";
    wheel3Faces[198] = "7";
    wheel3Faces[216] = "Lemon";
    wheel3Faces[234] = "Blank";
    wheel3Faces[252] = "Cherry";
    wheel3Faces[270] = "Bar";
    wheel3Faces[288] = "Lemon";
    wheel3Faces[306] = "Blank";
    wheel3Faces[324] = "Cherry";
    wheel3Faces[342] = "7";
    wheel3Faces[360] = "Bar";

}

//this function checks all the lines to see if theyre a match
function checkWinning(wheel1Angle : int, wheel2Angle : int, wheel3Angle : int)
    {
        //-----------------------------------------------Lower Line ------------------------------------------------------------------
        var temp1 : int = wheel1Angle;
        var temp2 : int = wheel2Angle;
        var temp3 : int = wheel3Angle;

        //checks if the middle line matches.
        if(checkLine(temp1,temp2,temp3) && betline1)
        {
            //create the bar to go over it.
            line1Bar.GetComponent.<Renderer>().enabled = true;
            incrementNumLines(wheel1Faces[temp1]);//keeps track of how many lines match
        }
        else //See if there is at least one cherry on the line if the line is not 3 of a kind
        {
            if(wheel1Faces[temp1].Equals("Cherry") && wheel2Faces[temp2].Equals("Cherry") && betline1)
            {
                //then we have [c] [c] [notc]
                //payout what two cherries are, if the betline is enabled.
                num2Cherry++;
                //invoke the showing of the middle line winner.
                line1Bar.GetComponent.<Renderer>().enabled = true;
            }
            else//check if the first icon is a cherry
            {
                if(wheel1Faces[temp1].Equals("Cherry") && betline1)//the first icon is a cherry
                {
                    num1Cherry++;
                    line1Bar.GetComponent.<Renderer>().enabled = true;//show the winning line
                }
            }
        }

        //-----------------------------------------Lower line ------------------------------------------------------------------------
        //temp = temp 18. if temp = 360, temp = 18.

        //---------------Fix first wheel-----------
        if(temp1 == 360)
        {
            temp1  = 18;
        }
        else{
            temp1 +=18;
        }
        //---------------Fix second wheel-----------
        if(temp2 == 360)
        {
            temp2 = 18;
        }
        else{
            temp2 +=18;
        }
        //-------------Fix third wheel----------------
        if(temp3 == 360)
        {
            temp =18;
        }
        else{
            temp3 +=18;
        }
        //---Now check if all of bottom line is the same
        if(checkLine(temp1,temp2,temp3) && betline2)
        {
            //Create the winning bar for the bottom line
            line2Bar.GetComponent.<Renderer>().enabled = true;
            incrementNumLines(wheel1Faces[temp1]);//keeps track of how many lines match
        }
        else //See if there is at least one cherry on the line if the line is not 3 of a kind
        {
            if(wheel1Faces[temp1].Equals("Cherry") && wheel2Faces[temp2].Equals("Cherry") && betline2)
            {
                //then we have [c] [c] [notc]
                //payout what two cherries are, if the betline is enabled.
                num2Cherry++;
                //invoke the showing of the middle line winner.
                line2Bar.GetComponent.<Renderer>().enabled = true;
            }
            else//check if the first icon is a cherry
            {
                if(wheel1Faces[temp1].Equals("Cherry") && betline2)//the first icon is a cherry
                {
                    num1Cherry++;
                    line2Bar.GetComponent.<Renderer>().enabled = true;//show the winning line
                }
            }
            
        }

        temp1 = wheel1Angle;
        temp2 = wheel2Angle;
        temp3 = wheel3Angle;
        //----------------------------------------Upper Line-----------------------------------------------------------------------
        //temp = temp -18, if temp = 0, then  = 342

        //fix first wheel
        if(temp1 == 0)
        {
            temp1  = 342;
        }
        else{
            temp1 -=18;
        }
        //---------------Fix second wheel----------------
        if(temp2 == 0)
        {
            temp2 = 342;
        }
        else{
            temp2 -=18;
        }
        //-------------Fix third wheel------------------
        if(temp3 == 0)
        {
            temp3 = 342;
        }
        else{
            temp3 -=18;
        }
        if(checkLine(temp1,temp2,temp3) && betline3)
        {
            line3Bar.GetComponent.<Renderer>().enabled = true;
            incrementNumLines(wheel1Faces[temp1]);//keeps track of how many lines match
        }
        else //See if there is at least one cherry on the line if the line is not 3 of a kind
        {
            if(wheel1Faces[temp1].Equals("Cherry") && wheel2Faces[temp2].Equals("Cherry") && betline3)
            {
                //then we have [c] [c] [notc]
                //payout what two cherries are, if the betline is enabled.
                num2Cherry++;
                //invoke the showing of the middle line winner.
                line3Bar.GetComponent.<Renderer>().enabled = true;
            }
            else//check if the first icon is a cherry
            {
                if(wheel1Faces[temp1].Equals("Cherry") && betline3)//the first icon is a cherry
                {
                    num1Cherry++;
                    line3Bar.GetComponent.<Renderer>().enabled = true;//show the winning line
                }
            }
        }

        //reset the temps
        temp1 = wheel1Angle;
        temp2 = wheel2Angle;
        temp3 = wheel3Angle;

        //-----------------Diag line 1-------------------------
        if(temp1 == 0)
        {
            temp1 = 342;
        }
        else{
            temp1 -=18;
        }
        //keep the middle the same
        //fix third wheel
        if(temp3 == 360)
        {
            temp3 =18;
        }
        else{
            temp3 +=18;
        }

        if(checkLine(temp1,temp2,temp3) && betline4 )
        {
            line4Bar.GetComponent.<Renderer>().enabled = true;
            incrementNumLines(wheel1Faces[temp1]);//keeps track of how many lines match
        }
        else //See if there is at least one cherry on the line if the line is not 3 of a kind
        {
            if(wheel1Faces[temp1].Equals("Cherry") && wheel2Faces[temp2].Equals("Cherry") && betline4)
            {
                //then we have [c] [c] [notc]
                //payout what two cherries are, if the betline is enabled.
                num2Cherry++;
                //invoke the showing of the middle line winner.
                line4Bar.GetComponent.<Renderer>().enabled = true;
            }
            else//check if the first icon is a cherry
            {
                if(wheel1Faces[temp1].Equals("Cherry") && betline4)//the first icon is a cherry
                {
                    num1Cherry++;
                    line4Bar.GetComponent.<Renderer>().enabled = true;//show the winning line
                }
            }
        }

        temp1 = wheel1Angle;
        temp2 = wheel2Angle;
        temp3 = wheel3Angle;

        //----------------Diag line 2--------------------------
        if(temp1 == 360)
        {
            temp1 = 18;
        }
        else{
            temp1 +=18;
        }

        //keep temp2 the same

        if(temp3 == 0)
        {
            temp3 = 342;
        }
        else{
            temp3 -= 18;
        }

        if(checkLine(temp1,temp2,temp3) && betline5)
        {
            line5Bar.GetComponent.<Renderer>().enabled = true;
            incrementNumLines(wheel1Faces[temp1]);//keeps track of how many lines match

            //TODO: completed the green lines to hilight the winning lines, next configure winnings.
        }
        else //See if there is at least one cherry on the line if the line is not 3 of a kind
        {
            if(wheel1Faces[temp1].Equals("Cherry") && wheel2Faces[temp2].Equals("Cherry") && betline5)
            {
                //then we have [c] [c] [notc]
                //payout what two cherries are, if the betline is enabled.
                num2Cherry++;
                //invoke the showing of the middle line winner.
                line5Bar.GetComponent.<Renderer>().enabled = true;
            }
            else//check if the first icon is a cherry
            {
                if(wheel1Faces[temp1].Equals("Cherry") && betline5)//the first icon is a cherry
                {
                    num1Cherry++;
                    line5Bar.GetComponent.<Renderer>().enabled = true;//show the winning line
                }
            }
        }

        textHolder += calculatePayout();
        if(textHolder < 1) showLoss = true;
        
        

      
    }

    //line 1 = middle
    //line 2 = upper
    //line 3 = lower
    //line 4 = bottom diag
    //line 5 = upper diag

    //returns true if the faces are a match, false if not.
 function checkLine(angle1 : int, angle2 : int, angle3 : int)
        {
            if(wheel1Faces[angle1].Equals(wheel2Faces[angle2])&& wheel1Faces[angle1].Equals(wheel3Faces[angle3]))//line matches
            {
                if(wheel1Faces[angle1] == "Blank") //dont count
                    return false;
                return true;
              
            }
            else return false;
         }

 function incrementNumLines(face : String)
            {
                switch(face)
                {
                    case "Cherry":
                        numCherryLines++;
                        break;
                    case "Blank":
                        numBarLines++;
                        break;
                    case "Lemon":
                        numLemonLines++;
                        break;
                    case "Bar":
                        numBarLines++;
                        break;
                    case "7":
                        num7Lines++;
                        break;
                    case "Diamond":
                        numDiamondLines++;
                        break;
                        
                }

            }
function calculatePayout()
{
    var tempCalc : float = 0.0;
    tempCalc+= 1*num1Cherry + 3*num2Cherry + numCherryLines*8 + numLemonLines*16 + numBarLines*40 + num7Lines*140 + numDiamondLines*1150;
    
   /* var coin : GameObject = GameObject.CreatePrimitive(PrimitiveType.Sphere);//the ball represents coins.
    coin.transform.position = Vector3 (1.75, .26, -0.8);
    coin.transform.localScale = Vector3 (.3, .3, .3);
    coin.GetComponent.<Renderer>().material.color = Color.yellow;
    coin.AddComponent.<Rigidbody>();
    coin.GetComponent.<Rigidbody>().drag =  3;*/

;

    return tempCalc;
}
   
function configureBetlines()//takes in the betlines and adjusts the booleans accordingly
{
    switch(betLines)
    {
        case 5:
            betline1 = betline2 = betline3 = betline4 = betline5 = true;
            break;
        case 4:
            betline1= betline2 = betline3 = betline4 = true;
            betline5 = false;
            break;
        case 3:
            betline1 = betline2 = betline3 = true;
            betline4 = betline5 = false;
            break;
        case 2:
            betline1 = betline2 = true;
            betline3 = betline4 = betline5 = false;
            break;
        case 1:
            betline1 = true;
            betline2 = betline3 = betline4 = betline5  =false;
            break;

    }
}

            
        