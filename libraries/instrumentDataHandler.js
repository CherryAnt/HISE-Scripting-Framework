/*
    Copyright 2018 David Healey

    This library is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

include("instrumentData.js");

namespace idh
{	
	reg instrumentsArticulations = []; //Just the instrument's articulations names
	const var displayNames = [];

	//Instrument loading functions
	inline function loadInstrument(name, sampleMaps)
	{
		local entry = instData.database[name]; //Get instrument entry from the database
		
		if (entry)
	    {	
            instrumentsArticulations = getArticulations(name); //Populate array of instrument's articulation names
		
            //Populate displayNames array
            for (k in entry.articulations)
            {
                displayNames.push(entry.articulations[k].displayName);
            }
		
            if (sampleMaps == true) loadSampleMaps(name, entry);
	    }
	}
		
	inline function loadSampleMaps(name, entry)
	{	
		local samplerIds = Synth.getIdList("Sampler");
		local sampleMaps = Sampler.getSampleMapList();
		local childSynth;
		local s;
		local sampleMapId = instData.database[name].sampleMapId;

		for (id in samplerIds)
	    {
	        childSynth = Synth.getChildSynth(id);
	        s = Synth.getSampler(id);

	        if (sampleMaps.contains(sampleMapId + "_" + id)) //A sample map for this instrument was found
	        {
	            childSynth.setBypassed(false); //Enable sampler
	            s.loadSampleMap(sampleMapId + "_" + id); //Load the sample map for this sampler
	        }
	        else
	        {
	            childSynth.setBypassed(true); //Bypass sampler
	            s.loadSampleMap("empty"); //Load the sample map for this sampler
	        }
	    }
	}
	
	inline function getInstrumentNameFromPresetName()
    {
        local presetName = Engine.getCurrentUserPresetName();
        local instrumentName = "";
        
        if (presetName != "")
        {
            for (n in instData.database)
            {                
                if (presetName.indexOf(n) != -1) //Preset name contains database entry name
                {
                    instrumentName = n;
                    break;
                }
            }
        }
        return instrumentName;
    }
			
	//Returns the data entry for the given instrument
	inline function getData(name)
	{		
		local entry = instData.database[name]; //Get instrument entry from the database
		
		Console.assertIsObjectOrArray(entry); //Error if entry not found
		
		return entry;
	}
	
	inline function getArticulations(name)
    {		
		local data = instData.database[name].articulations; //Get instrument entry from the database
		local articulations = [];

		for (k in data)
		{
			articulations.push(k);
		}
		
		return articulations;
    }
	
	//Returns the full range of the instrument (maximum range of all articulations)
	inline function getRange(name)
	{				
		return instData.database[name].range;
	}
	
	//Returns the range of the specified articulation
	inline function getArticulationRange(name, a)
	{		
		return instData.database[name].articulations[a].range;
	}
		
	//Returns the number of articulations either for the specified insturment or from allArticulations
	inline function getNumArticulations(all)
	{
		if (all == true) //All articulations
		{	
		    return instData.allArticulations.length;
		}
		else //Current instrument only
		{
			return instrumentsArticulations.length;
		}
	}
	
	//Returns an array containing the names of either the instrument's or all articulations
	inline function getArticulationNames(all)
	{
		if (all == true) //All articulations
		{
            return instData.allArticulations;
		}
		else //Current instrument only
		{
			return instrumentsArticulations;
		}
	}
	
	//Returns the display names array
	inline function getArticulationDisplayNames()
	{
        return displayNames;
	}
	
	//Get the display name from the instruments articulation index
	inline function getDisplayName(idx)
    {
        return displayNames[idx];
    }
    
    //Get the display name from the articulation's name
    inline function getDisplayNameFromArticulationName(a)
    {
        return displayNames[instrumentsArticulations.indexOf(a)];
    }
		
	//Returns the name of the articulation specified by the given index
	inline function getArticulationName(idx, all)
    {
        if (all == true)
        {
            return instData.allArticulations[idx];
        }
        else 
        {
            return instrumentsArticulations[idx];
        }            
    }
    
    inline function getArticulationIndex(articulationName, all)
    {
        if (all == true)
        {
            return instData.allArticulations.indexOf(articulationName);
        }
        else
        {
            return instrumentsArticulations.indexOf(articulationName);   
        }
    }
    	
	//For the given program number returns the index in the instData.programs array
	inline function getProgramIndex(progNum)
	{
		return instData.programs.indexOf(progNum);
	}
	
	inline function isMetaArticulation(idx)
    {
        if (instData.allArticulations[idx].indexOf("meta_") == -1)
        {
            return false;
        }
        return true;
    }
    
    //Returns the index of the articulation's (a) parent, if it has one
    inline function getParentIdx(name, a)
    {
        local parent = instData.database[name].articulations[a].parent;
        
        if (typeof parent == "string")
        {
            return instData.allArticulations.indexOf(parent);
        }
        else 
        {
            return -1;
        }
    }
    
    //Returns the attack for the given insturment name and articulation (a)
    inline function getAttack(name, a)
    {
        return instData.database[name].articulations[a].attack;
    }
    
    //Returns the release for the given insturment name and articulation (a)
    inline function getRelease(name, a)
    {
        return instData.database[name].articulations[a].release;
    }
}