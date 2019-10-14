//
//  ShareViewController.swift
//  sharing
//
//  Created by team on 15.10.19.
//  Copyright © 2019 regensburg:re kollektiv. All rights reserved.
//

import UIKit
import Social
import MobileCoreServices

class ShareViewController: UIViewController {
  
  var docPath = ""
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    let containerURL = FileManager().containerURL(forSecurityApplicationGroupIdentifier: "group.network.foodsharing")!
    docPath = "\(containerURL.path)/share"
    
    //  Create directory if not exists
    do {
      try FileManager.default.createDirectory(atPath: docPath, withIntermediateDirectories: true, attributes: nil)
    } catch let error as NSError {
      print("Could not create the directory \(error)")
    } catch {
      fatalError()
    }
    
    //  removing previous stored files
    let files = try! FileManager.default.contentsOfDirectory(atPath: docPath)
    for file in files {
      try? FileManager.default.removeItem(at: URL(fileURLWithPath: "\(docPath)/\(file)"))
    }
  }
  
  override func viewDidAppear(_ animated: Bool) {
    
    let alertView = UIAlertController(title: "Foodsharing", message: " ", preferredStyle: .alert)
    
    self.present(alertView, animated: true, completion: {
      
      let group = DispatchGroup()
      
      NSLog("inputItems: \(self.extensionContext!.inputItems.count)")
      
      for item: Any in self.extensionContext!.inputItems {
        
        let inputItem = item as! NSExtensionItem
        
        for provider: Any in inputItem.attachments! {
          
          let itemProvider = provider as! NSItemProvider
          group.enter()
          itemProvider.loadItem(forTypeIdentifier: kUTTypeData as String, options: nil) { data, error in
            if error == nil {
              //  Note: "data" may be another type (e.g. Data or UIImage). Casting to URL may fail. Better use switch-statement for other types.
              //  "screenshot-tool" from iOS11 will give you an UIImage here
              let url = data as! URL
              let path = "\(self.docPath)/\(url.pathComponents.last ?? "")"
              print(">>> sharepath: \(String(describing: url.path))")
              
              try? FileManager.default.copyItem(at: url, to: URL(fileURLWithPath: path))
              
            } else {
              NSLog("\(error)")
            }
            group.leave()
          }
        }
      }
      
      group.notify(queue: DispatchQueue.main) {
        NSLog("done")
        
        let files = try! FileManager.default.contentsOfDirectory(atPath: self.docPath)
        
        NSLog("directory: \(files)")
        
        //  Serialize filenames, call openURL:
        do {
          // let jsonData : Data = try JSONSerialization.data(
          //  withJSONObject: files,
          //  options: JSONSerialization.WritingOptions.init(rawValue: 0))
          // let jsonString = (NSString(data: jsonData, encoding: String.Encoding.utf8.rawValue)! as String).addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
          
          // Ignore everything but the first file
          let result = self.openURL(URL(string: "foodsharing://foodsharing.de/share?\(self.docPath)/\(files[0])")!)
        } catch {
          alertView.message = "Error: \(error.localizedDescription)"
        }
        self.dismiss(animated: false) {
          self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
        }
      }
    })
  }
  
  //  Function must be named exactly like this so a selector can be found by the compiler!
  //  Anyway - it's another selector in another instance that would be "performed" instead.
  @objc func openURL(_ url: URL) -> Bool {
    var responder: UIResponder? = self
    while responder != nil {
      if let application = responder as? UIApplication {
        return application.perform(#selector(openURL(_:)), with: url) != nil
      }
      responder = responder?.next
    }
    return false
  }
}
