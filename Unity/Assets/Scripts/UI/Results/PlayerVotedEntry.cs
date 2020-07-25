using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerVotedEntry : MonoBehaviour
{
    public Text playerNameText;
    public void SetupInformation(string playerId)
    {
        if (!PlayerManager.Instance.playerList.ContainsKey(playerId))
        {
            SetupInformation(Player.Instance);
        }
        else
        {
            playerNameText.text = PlayerManager.Instance.playerList[playerId].Name + " morreu na forca";
        }
    }

    public void SetupInformation(Player player)
    {
        playerNameText.text = player.Name + " morreu na forca";
    }
}