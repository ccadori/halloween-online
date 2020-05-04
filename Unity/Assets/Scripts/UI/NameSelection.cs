using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class NameSelection : MonoBehaviour
{
    [SerializeField] InputField NameInputField;
    [SerializeField] Button SendNameButton;
    [SerializeField] Canvas loginScreen;
    [SerializeField] Canvas matchMakingScreen;

    public void SendName()
    {
        //NetworkManager.SendEmitMessage("player-name", NameInputField.text);
        Player.Instance.Name = NameInputField.text;
        loginScreen.enabled = false;
        matchMakingScreen.enabled = true;
    }
}