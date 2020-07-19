using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerDeathEntry : MonoBehaviour
{
    public Text playerNameText;

    public void SetupInformation(string playerId)
    {
        playerNameText.text = PlayerManager.Instance.playerList[playerId].Name + " morreu por causas desconhecidas";
    }
}