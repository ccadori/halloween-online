using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class NameSelection : MonoBehaviour
{
    [SerializeField] InputField NameInputField;
    [SerializeField] Button SendNameButton;
    [SerializeField] GameObject loginScreen;
    [SerializeField] GameObject matchMakingScreen;

    private void OnEnable()
    {
        NetworkManager.OnPlayerNameAccepted += OnPlayerNameAccepted;
    }

    private void OnDisable()
    {
        NetworkManager.OnPlayerNameAccepted -= OnPlayerNameAccepted;
    }

    public void SendName()
    {
        //NetworkManager.SendEmitMessage("player-name", NameInputField.text);
        Player.Instance.Name = NameInputField.text;
        loginScreen.SetActive(false);
        matchMakingScreen.SetActive(true);
    }

    void OnPlayerNameAccepted()
    {
        loginScreen.SetActive(false);
        matchMakingScreen.SetActive(true);
    }
}