using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class WerewolfHowlingSound : MonoBehaviour
{

    [SerializeField] AudioSource audioSource;

    private void OnEnable()
    {
        NetworkManager.OnNight += onNight;
    }

    private void OnDisable()
    {
        NetworkManager.OnNight -= onNight;
    }

    void onNight()
    {
        audioSource.Play();
    }
}