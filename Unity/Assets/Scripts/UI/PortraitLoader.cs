using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PortraitLoader : MonoBehaviour
{
    [SerializeField] Image image;

    private void OnEnable()
    {
        NetworkManager.OnReceiveRole += onReceiveRole;
    }

    private void OnDisable()
    {
        NetworkManager.OnReceiveRole -= onReceiveRole;
    }

    private void onReceiveRole(RoleData roleData)
    {
        Debug.Log(roleData.id);
        image.sprite = Resources.Load<Sprite>("Portraits/" + roleData.id);
    }
}
