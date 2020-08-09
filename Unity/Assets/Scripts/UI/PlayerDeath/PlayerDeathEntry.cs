using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class PlayerDeathEntry : MonoBehaviour
{
    public TextMeshProUGUI playerNameText;

    public void SetupInformation(string playerId)
    {
        if(!PlayerManager.Instance.playerList.ContainsKey(playerId))
        {
            SetupInformation(Player.Instance);
        }
        else
        {
            playerNameText.text = PlayerManager.Instance.playerList[playerId].Name + " morreu por causas desconhecidas";
        }
    }

    public void SetupInformation(Player player)
    {
        playerNameText.text = player.Name + " morreu por causas desconhecidas";
    }
}