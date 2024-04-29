import { useContext,useState,useEffect } from "react";


const scoreManagementContext = useContext();

function ScoreManagement(){

    return(
        <>
          <scoreManagementContext.Provider>
              
          </scoreManagementContext.Provider>
        </>
    );
}

export default ScoreManagement;