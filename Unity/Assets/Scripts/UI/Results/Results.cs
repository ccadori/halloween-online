using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Results : MonoBehaviour
{
    [SerializeField] GameObject townVictoryScreen;
    [SerializeField] GameObject monstersVictoryScreen;

    public void OnEnable()
    {
        NetworkManager.OnMatchEnd += OnMatchEnd;
    }

    public void OnDisable()
    {
        NetworkManager.OnMatchEnd -= OnMatchEnd;
    }

    private void OnMatchEnd(MatchEndData data)
    {
        if(data.isTownWinner)
        {
            townVictoryScreen.SetActive(true);
        }
        else
        {
            monstersVictoryScreen.SetActive(true);
        }
    }

    public void LeaveMatch()
    {
        NetworkManager.Instance.CloseConnection();
    }
}