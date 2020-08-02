using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class QuitBttn : MonoBehaviour
{
    public void QuitMatch()
    {
        NetworkManager.Instance.CloseConnection();
    }
}