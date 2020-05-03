using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PortraitLoader : MonoBehaviour
{
    [SerializeField] Image Image;

    private void OnEnable()
    {
        NetworkManager.OnReceiveRole += onReceiveRole;
    }

    private void OnDisable()
    {
        NetworkManager.OnReceiveRole -= onReceiveRole;
    }

    private void onReceiveRole(PlayerRoles role)
    {
        Debug.Log("Portraits/" + (int)role);
        Image.sprite = Resources.Load<Sprite>("Portraits/" + (int)role);
    }
}
