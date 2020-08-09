using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class NameSelection : MonoBehaviour
{
    [SerializeField] TMP_InputField nameInputField;
    [SerializeField] Button sendNameButton;
    [SerializeField] Canvas loginScreen;
    [SerializeField] Canvas matchMakingScreen;

    public void SendName()
    {
        //NetworkManager.SendEmitMessage("player-name", NameInputField.text);
        Player.Instance.Name = nameInputField.text;
        loginScreen.enabled = false;
        matchMakingScreen.enabled = true;
    }
}