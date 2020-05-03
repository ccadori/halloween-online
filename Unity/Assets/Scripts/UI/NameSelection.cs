using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class NameSelection : MonoBehaviour
{
    [SerializeField] InputField NameInputField;
    [SerializeField] Button SendNameButton;
    [SerializeField] Canvas Canvas;

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
        NetworkManager.SendEmitMessage("player-name", NameInputField.text);
        SendNameButton.interactable = false;
    }

    void OnPlayerNameAccepted()
    {
        Canvas.enabled = false;
    }
}