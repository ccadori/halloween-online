using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class RoosterSound : MonoBehaviour
{

    [SerializeField] AudioSource audioSource;

    private void OnEnable()
    {
        NetworkManager.OnNightEnded += OnNightEnded;
    }

    private void OnDisable()
    {
        NetworkManager.OnNightEnded -= OnNightEnded;
    }

    void OnNightEnded()
    {
        audioSource.Play();
    }
}