/**
 * Title: velocityScaler.js
 * Author: David Healey
 * Date: 20/11/2017
 * Modified: 20/11/2017
 * License: Public Domain
*/

Content.setWidth(650);
Content.setHeight(200);

reg scaledVel;

const var tblVel = Content.addTable("tblVel", 0, 25);
tblVel.set("width", 300);
tblVel.set("height", 150);

const var lblIn = Content.addLabel("lblIn", 350, 25);
lblIn.set("width", 100);

const var lblOut = Content.addLabel("lblOut", 450, 25);
lblOut.set("width", 100);function onNoteOn()
{
	lblIn.set("text", Message.getVelocity());
	scaledVel = 127 * tblVel.getTableValue(Message.getVelocity());

	//Stop the note if velocity is 0
	if (scaledVel <= 0)
	{
		Message.ignoreEvent(true);
		lblOut.set("text", 0);
	}
	else
	{
		Message.setVelocity(scaledVel);
		lblOut.set("text", Message.getVelocity());
	}


}
function onNoteOff()
{

}
function onController()
{

}
function onTimer()
{

}
function onControl(number, value)
{

}
 
